import ResetEmail from "@/emails/reset-email";
import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { Resend } from "resend";
export const dynamic = "force-dynamic";
dayjs.extend(require("dayjs/plugin/utc"));

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "email", required: true }]);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { userId } = await getIdentifiers();

    const user = await prisma.profile.findFirstOrThrow({ where: { userId } });
    const exists = await prisma.user.findFirst({
      where: { email: params.email },
    });

    if (exists) throw new Error("Email already exists");

    const data = await prisma.resetToken.create({
      data: {
        user: { connect: { id: userId } },
        type: "EMAIL",
        token: Math.floor(Math.random() * 1000000000).toString(),
        expires: dayjs().utc().add(3, "hour").toISOString(),
        emailData: params.email,
      },
    });

    console.log(data);

    await resend.emails.send({
      from: "hello@dysperse.com",
      to: params.email,
      subject: "Reset your email",
      react: ResetEmail({
        email: params.email,
        name: user.name,
        token: data.token,
      }),
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "token", required: true }]);

    const { userId } = await getIdentifiers();

    const tokenData = await prisma.resetToken.findFirstOrThrow({
      where: {
        AND: [
          { token: params.token },
          { type: "EMAIL" },
          { emailData: { not: null } },
          { userId },
          { expires: { gte: dayjs().utc().toISOString() } },
        ],
      },
      select: {
        id: true,
        emailData: true,
      },
    });

    await prisma.user.update({
      where: { id: userId },
      data: { email: tokenData.emailData as string },
    });

    await prisma.resetToken.delete({ where: { id: tokenData.id } });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
