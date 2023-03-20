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
        {
          dailyRoutineNudge: true,
        },
        {
          user: {
            email: "manusvathgurudath@gmail.com",
          },
        },
      ],
    },
    select: {
      user: {
        select: {
          notificationSubscription: true,
          timeZone: true,
          Routine: true,
        },
      },
    },
  });

  // Make sure that user actually has routines
  subscriptions = subscriptions.filter(
    (subscription) => subscription.user.Routine.length > 0
  );

  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );

  // For each user
  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i];
    const { notificationSubscription, timeZone, Routine }: any =
      subscription.user;

    // Current time in user's timezone
    const currentTimeInUserTimeZone = dayjs().tz(timeZone).hour();

    const currentRoutine = Routine.find(
      (routine) => routine.timeOfDay === currentTimeInUserTimeZone
    );
    if (currentRoutine) {

    }

    try {
      await DispatchNotification({
        title: "Let's work on your goals!",
        icon:"",
        body: "Tap to start your daily routine",
        actions: [
          {
            title: "⚡ Start my daily routine",
            action: "startDailyRoutine",
          },
        ],
        subscription: notificationSubscription,
      });
    } catch (error) {
      // If there's an error, log it
      console.log(error);
    }
  }

  res.status(200).json({ message: "Notification sent" });
};

export default Notification;
