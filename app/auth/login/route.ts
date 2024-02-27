import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
    )[0];

    // get body
    const params = await getApiParams(
      req,
      [
        { name: "email", required: true },
        { name: "password", required: true },
        { name: "deviceName", required: true },
        { name: "deviceType", required: true },
        { name: "twoFactorSecret", required: false },
      ],
      { type: "BODY" }
    );

    const acc = await prisma.user.findFirstOrThrow({
      where: {
        email: params.email,
      },
      select: {
        id: true,
        password: true,
        twoFactorSecret: true,
      },
    });

    if (acc.twoFactorSecret && !params.twoFactorSecret) {
      return Response.json({
        success: false,
        twoFactorRequired: true,
      });
    }

    // Validate password
    const valid = await argon2.verify(acc.password, params.password);
    if (!valid) throw new Error("Invalid password");

    const session = await prisma.session.create({
      data: {
        userId: acc.id,
        deviceName: params.deviceName,
        deviceType: params.deviceType.toString(),
        ip,
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
