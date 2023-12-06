import { sessionData } from "@/app/session/route";
import { handleApiError } from "@/lib/server/helpers";
import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import argon2 from "argon2";
import { NextRequest } from "next/server";
import * as twofactor from "node-2fa";

/**
 * Creates a session and stores it in the database
 * @param {number} id
 * @param {any} res
 * @returns {any}
 */
export async function createSession(id: any, ip: any) {
  // Create a session token in the session table
  const session = await prisma.session.create({
    data: {
      ip,
      user: {
        connect: {
          id: id as any,
        },
      },
    },
  });

  const token = session.id;
  return token;
}

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function POST(req: NextRequest) {
  try {
    const requestBody = await req.json();

    if (process.env.NODE_ENV !== "development") {
      // FIRST, Validate the captcha

      const endpoint =
        "https://challenges.cloudflare.com/turnstile/v0/siteverify";
      const secret: any = process.env.CAPTCHA_KEY;
      const body = `secret=${encodeURIComponent(
        secret
      )}&response=${encodeURIComponent(requestBody.token)}`;

      const captchaRequest = await fetch(endpoint, {
        method: "POST",
        body,
        headers: {
          "content-type": "application/x-www-form-urlencoded",
        },
      });

      const data = await captchaRequest.json();

      if (!data.success && data.error !== "internal_error") {
        return Response.json({ message: "Invalid Captcha" });
      }
    }

    // Get the user's email and password from the request body
    const { email } = requestBody;

    try {
      // Find the user in the database
      const user = await prisma.user.findFirstOrThrow({
        where: {
          OR: [
            { email: email.toLowerCase() },
            { username: email.toLowerCase() },
          ],
        },
        select: {
          id: true,
          password: true,
          twoFactorSecret: true,
          notifications: {
            select: { pushSubscription: true },
          },
        },
      });

      // If the user doesn't exist, return an error
      if (!user) {
        return Response.json({ message: "Invalid email or password" });
      }

      if (!requestBody.password) throw new Error("Missing password in body");

      const validPassword = await argon2.verify(
        user.password,
        requestBody.password
      );

      if (!validPassword) {
        return Response.json({ message: "Invalid email or password" });
      }

      if (
        !requestBody.twoFactorCode &&
        user.twoFactorSecret !== "" &&
        user.twoFactorSecret !== "false"
      ) {
        const newToken = twofactor.generateToken(user.twoFactorSecret);

        if (user.notifications?.pushSubscription)
          await DispatchNotification({
            subscription: user.notifications?.pushSubscription as string,
            title: `${newToken?.token} is your Dysperse login code`,
            body: "Dysperse employess will NEVER ask for this code. DO NOT share it with ANYONE!",
            actions: [],
          });

        return Response.json({
          twoFactor: true,
          token: newToken,
          secret: user.twoFactorSecret,
        });
      }

      if (requestBody.twoFactorCode) {
        const login = twofactor.verifyToken(
          user.twoFactorSecret,
          requestBody.twoFactorCode
        );

        if (!login || login.delta !== 0) {
          return Response.json({ error: "Invalid code" });
        }
      }

      if (user.notifications?.pushSubscription)
        await DispatchNotification({
          subscription: user.notifications?.pushSubscription as string,
          title: "Account activity alert",
          body: "Someone (hopefully you) has successfully logged in to your account",
          actions: [],
        });

      const ip = "Unknown";
      const key = await createSession(user.id, ip);

      // Get info
      const info = await sessionData(key);

      return Response.json(info);
    } catch (e) {
      return handleApiError(e);
    }
  } catch (e) {
    return handleApiError(e);
  }
}
