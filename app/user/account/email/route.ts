import ResetEmail from "@/emails/reset-email";
import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "email", required: true }]);

    const resend = new Resend(process.env.RESEND_API_KEY);

    const { userId } = await getIdentifiers();

    const user = await prisma.profile.findFirstOrThrow({
      where: { userId },
      select: { name: true },
    });

    const data = await prisma.resetToken.create({
      data: {
        user: { connect: { id: userId } },
        type: "EMAIL",
        expires: dayjs().utc().add(3, "hour").toISOString(),
      },
    });

    await resend.emails.send({
      from: "hello@dysperse.com",
      to: params.email,
      subject: "Reset your email",
      react: ResetEmail({
        email: params.email,
        name: user.name,
      }),
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
