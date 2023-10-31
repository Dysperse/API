import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";

export async function GET() {
  await prisma.qrToken.deleteMany({
    where: {
      expires: {
        lt: dayjs().subtract(1, "day").toDate(),
      },
    },
  });
  return Response.json({ success: true });
}
