import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/verifyTurnstileToken";
import argon2 from "argon2";
import { NextRequest } from "next/server";
const twofactor = require("node-2fa");

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export async function POST(req: NextRequest) {
  try {
    // get body
    const params = await getApiParams(
      req,
      [
        { name: "ip", required: true },
        { name: "email", required: true },
        { name: "password", required: true },
        { name: "deviceName", required: true },
        { name: "deviceType", required: true },
        { name: "twoFactorCode", required: false },
        { name: "captchaToken", required: true },
      ],
      { type: "BODY" }
    );

    await verifyTurnstileToken(params.captchaToken);

    const acc = await prisma.user.findFirstOrThrow({
      where: {
        email: params.email.toLowerCase(),
      },
      select: {
        id: true,
        password: true,
        twoFactorSecret: true,
      },
    });

    if (acc.twoFactorSecret && !params.twoFactorCode) {
      return Response.json({
        success: false,
        twoFactorRequired: true,
      });
    }

    if (acc.twoFactorSecret && params.twoFactorCode) {
      if (!twofactor.verifyToken(acc.twoFactorSecret, params.twoFactorCode)) {
        return Response.json({
          success: false,
          twoFactorRequired: true,
        });
      }
    }

    // Validate password
    const valid = await argon2.verify(acc.password, params.password);
    if (!valid) throw new Error("Invalid password");

    const session = await prisma.session.create({
      data: {
        userId: acc.id,
        deviceName: params.deviceName,
        deviceType: params.deviceType.toString(),
        ip: params.ip,
      },
    });

    return Response.json({
      success: true,
      session: session.id,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
