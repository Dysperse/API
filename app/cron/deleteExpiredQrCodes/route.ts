import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import { headers } from "next/headers";

export async function GET() {
  if (
    headers().get("Authorization") !== `Bearer ${process.env.CRON_SECRET}` &&
    process.env.NODE_ENV === "production"
  ) {
    return Response.json({
      currentHeaders: headers().get("Authorization"),
      error: "Unauthorized",
    });
  }

  const d = await prisma.qrToken.deleteMany({
    where: {
      expires: {
        lt: dayjs().subtract(1, "day").toDate(),
      },
    },
  });

  return Response.json({ success: true, count: d.count });
}
