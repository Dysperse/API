import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const data = await prisma.resetToken.create({
      data: {
        user: { connect: { id: userId } },
        type: "EMAIL",
        expires: dayjs().utc().add(3, "hour").toISOString(),
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
