import { serialize } from "cookie";
import jwt from "jsonwebtoken";
import { prisma } from "../../lib/client";
import argon2 from "argon2";
import * as twofactor from "node-2fa";

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
  let now = new Date();
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

export default async function handler(req, res) {
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

  const encoded = await createSession(user.id, res);
  res.json({ success: true, key: encoded });
}
