import ForgotPasswordEmail from "@/emails/forgot-password";
import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/verifyTurnstileToken";
import argon2 from "argon2";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { Resend } from "resend";

dayjs.extend(require("dayjs/plugin/utc"));

// User requests a password reset
export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);

    const params = await getApiParams(
      req,
      [
        { name: "email", required: true },
        { name: "captchaToken", required: true },
      ],
      { type: "BODY" }
    );

    await verifyTurnstileToken(params.captchaToken);

    const user = await prisma.profile.findFirst({
      where: {
        OR: [
          { user: { username: params.email } },
          { user: { email: params.email } },
        ],
      },
    });

    if (!user) throw new Error("ERROR_USER_NOT_FOUND");

    const data = await prisma.resetToken.create({
      data: {
        user: { connect: { email: params.email } },
        type: "PASSWORD",
        expires: dayjs().utc().add(3, "hour").toISOString(),
        token: Math.floor(Math.random() * 1000000000).toString(),
      },
    });

    await resend.emails.send({
      from: "hello@dysperse.com",
      to: params.email,
      subject: "Reset your email",
      react: ForgotPasswordEmail({
        email: params.email,
        name: user.name,
        token: data.token,
      }),
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

// User resets their password
export async function PUT(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
    )[0];

    const params = await getApiParams(
      req,
      [
        { name: "email", required: true },
        { name: "token", required: true },
        { name: "captchaToken", required: true },
        { name: "password", required: true },
        { name: "deviceName", required: true },
        { name: "deviceType", required: true },
      ],
      { type: "BODY" }
    );

    const user = await prisma.resetToken.findFirstOrThrow({
      where: {
        AND: [
          { token: params.token },
          { type: "PASSWORD" },
          { user: { email: params.email } },
          { expires: { gte: dayjs().utc().toISOString() } },
        ],
      },
    });

    const hash = await argon2.hash(params.password);

    await prisma.$transaction([
      prisma.resetToken.delete({ where: { id: user.id } }),
      prisma.user.update({
        where: { email: params.email },
        data: { password: hash },
      }),
      prisma.session.deleteMany({
        where: { userId: user.userId },
      }),
    ]);

    const data = await prisma.session.create({
      data: {
        userId: user.userId,
        deviceName: params.deviceName,
        deviceType: params.deviceType.toString(),
        ip,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
