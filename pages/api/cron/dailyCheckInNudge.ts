const webPush = require("web-push");
import dayjs from "dayjs";
import { DispatchNotification } from "../../../lib/server/notification";
import { prisma } from "../../../lib/server/prisma";

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
  // Select user's push notification subscription URL, also asking one of their incompleted goals.
  let subscriptions = await prisma.notificationSettings.findMany({
    where: {
      AND: [
        { dailyCheckInNudge: true },
        {
          ...(process.env.NODE_ENV !== "production" && {
            user: { email: "manusvathgurudath@gmail.com" },
          }),
        },
      ],
    },
    select: {
      user: { select: { notificationSubscription: true, timeZone: true } },
    },
  });

  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );

  // For each user
  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i];
    const { notificationSubscription, timeZone }: any = subscription.user;

    // Current time in user's timezone
    const currentTimeInUserTimeZone = dayjs().tz(timeZone).hour();

    // Check if user has enabled routine for that day
    if (
      currentTimeInUserTimeZone == 11 ||
      process.env.NODE_ENV !== "production"
    ) {
      try {
        await DispatchNotification({
          title: "How's your day been so far?",
          icon: "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f603.png",
          body: "Tap to check-in",
          actions: [
            {
              title: "Great!",
              action: `dailyCheckIn-1f601`,
            },
            {
              title: "Not so great...",
              action: `dailyCheckIn-1f614`,
            },
          ],
          subscription: notificationSubscription,
        });
      } catch (error) {
        console.log(error);
      }
    }
  }

  res.status(200).json({ message: "Notification sent" });
};

export default Notification;
