const webPush = require("web-push");
import dayjs from "dayjs";
import { DispatchNotification } from "../../../lib/server/notification";
import { prisma } from "../../../lib/server/prisma";

import { Routine } from "@prisma/client";
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
          ...(process.env.NODE_ENV !== "production" && {
            user: {
              email: "manusvathgurudath@gmail.com",
            },
          }),
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
    const currentDayInUserTimeZone = dayjs().tz(timeZone).day();

    const currentRoutine = Routine.find(
      (routine: Routine) => routine.timeOfDay + 1 === currentTimeInUserTimeZone
    );

    if (currentRoutine) {
      const daysOfWeek = JSON.parse(currentRoutine.daysOfWeek);

      // Check if user has enabled routine for that day
      if (daysOfWeek[currentDayInUserTimeZone] === true) {
        try {
          await DispatchNotification({
            title: `It's time to start "${currentRoutine.name.trim()}"!`,
            icon:
              `https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/${currentRoutine.emoji}.png` ||
              "https://assets.dysperse.com/v5/ios/192.png",
            body: "Let's get started! Tap to open",
            actions: [
              {
                title: "👉 Start",
                action: `routine-${currentRoutine.id}`,
              },
            ],
            subscription: notificationSubscription,
          });
        } catch (error) {
          console.log(error);
        }
      }
    }
  }

  res.status(200).json({ message: "Notification sent" });
};

export default Notification;
