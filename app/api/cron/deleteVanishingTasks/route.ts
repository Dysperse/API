import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { headers } from "next/headers";

dayjs.extend(utc);
dayjs.extend(timezone);

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

  let twoWeeksAgo = new Date(new Date().getTime() - 14 * 24 * 60 * 60 * 1000);

  await prisma.task.deleteMany({
    where: {
      AND: [
        { property: { vanishingTasks: true } },
        { completed: true },
        { due: { lt: twoWeeksAgo } },
      ],
    },
  });

  return Response.json({
    message: "Successfully deleted tasks with vanish mode turned on!",
  });
}
