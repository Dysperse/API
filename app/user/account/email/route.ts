import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { Resend } from "resend";

export async function POST(req: NextRequest) {
  try {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { userId } = await getIdentifiers();

    const data = await prisma.resetToken.create({
      data: {
        user: { connect: { id: userId } },
        type: "EMAIL",
        expires: dayjs().utc().add(3, "hour").toISOString(),
      },
    });
    // await resend.emails.send({
    //   from: 'you@example.com',
    //   to: 'user@gmail.com',
    //   subject: 'hello world',
    //   react: <></>
    // });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
