import argon2 from "argon2";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import * as twofactor from "node-2fa";
import { DispatchNotification } from "../../lib/notification";
import { prisma } from "../../lib/prismaClient";

/**
 * Creates a session and stores it in the database
 * @param {number} id
 * @param {any} res
 * @returns {any}
 */
export async function createSession(id: number, res) {
  // Create a session token in the session table
  const session = await prisma.session.create({
    data: {
      user: {
        connect: {
          id: id,
        },
      },
    },
  });

  const token = session.id;

  const encoded = jwt.sign(
    {
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 * 4 * 12, // 1 year
      accessToken: token,
    },
    process.env.SECRET_COOKIE_PASSWORD
  );
  const now = new Date();
  now.setDate(now.getDate() * 7 * 4);
  res.setHeader(
    "Set-Cookie",
    serialize("token", encoded, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 4, // 1 month
      expires: now,
    })
  );
  return encoded;
}

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  // FIRST, Validate the captcha
  const endpoint = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
  const secret: any = process.env.CAPTCHA_KEY;
  const body = `secret=${encodeURIComponent(
    secret
  )}&response=${encodeURIComponent(req.body.token)}`;

  const captchaRequest = await fetch(endpoint, {
    method: "POST",
    body,
    headers: {
      "content-type": "application/x-www-form-urlencoded",
    },
  });

  const data = await captchaRequest.json();
  if (!data.success) {
    return res.status(401).json({ message: "Invalid Captcha" });
  }

  // Get the user's email and password from the request body
  const { email } = req.body;

  // Find the user in the database
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
    select: {
      id: true,
      password: true,
      twoFactorSecret: true,
      notificationSubscription: true,
    },
  });
  // If the user doesn't exist, return an error
  if (!user) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const validPassword = await argon2.verify(user.password, req.body.password);

  if (!validPassword) {
    return res.status(401).json({ message: "Invalid email or password" });
  }
  if (
    !req.body.twoFactorCode &&
    user.twoFactorSecret !== "" &&
    user.twoFactorSecret !== "false"
  ) {
    const newToken = twofactor.generateToken(user.twoFactorSecret);

    await DispatchNotification({
      subscription: user.notificationSubscription as string,
      title: `${newToken?.token} is your Dysperse login code`,
      body: "Dysperse employess will NEVER ask for this code. DO NOT share it with ANYONE!",
      actions: [],
    });

    return res.json({
      twoFactor: true,
      token: newToken,
      secret: user.twoFactorSecret,
    });
  }

  if (req.body.twoFactorCode) {
    const login = twofactor.verifyToken(
      user.twoFactorSecret,
      req.body.twoFactorCode
    );

    if (!login || login.delta !== 0) {
      return res.status(401).json({ error: "Invalid code" });
    }
  }

  if (req.body.application) {
    const token = await prisma.oAuthToken.create({
      data: {
        user: {
          connect: {
            id: user.id,
          },
        },
      },
    });
    await DispatchNotification({
      subscription: user.notificationSubscription as string,
      title: "Account activity alert",
      body: "Your Dysperse ID has been used to sign into an authorized application",
      actions: [],
    });
    return res.json({ success: true, accessToken: token.accessToken });
  }

  await DispatchNotification({
    subscription: user.notificationSubscription as string,
    title: "Account activity alert",
    body: "Someone (hopefully you) has successfully logged in to your account",
    actions: [],
  });
  const encoded = await createSession(user.id, res);
  // cacheData.del(req.cookies.token);
  res.json({ success: true, key: encoded });
}
