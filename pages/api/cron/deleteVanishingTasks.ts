import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";

import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const Notification = async (req, res) => {
  if (
    req.headers.authorization !== `Bearer ${process.env.COACH_CRON_API_KEY}` &&
    process.env.NODE_ENV === "production"
  ) {
    res.status(401).json({
      currentHeaders: req.headers.authorization,
      error: "Unauthorized",
    });
    return;
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

  res.json({
    message: "Successfully deleted tasks with vanish mode turned on!",
  });
};

export default Notification;
