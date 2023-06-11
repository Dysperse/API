const webPush = require("web-push");
import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import { RoutineItem } from "@prisma/client";
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
  // Select user's push notification subscription URL, also asking one of their incompleted goals.
  let subscriptions = await prisma.notificationSettings.findMany({
    where: {
      AND: [
        { dailyRoutineNudge: true },
        {
          ...(process.env.NODE_ENV !== "production" && {
            user: { email: "manusvathgurudath@gmail.com" },
          }),
        },
      ],
    },
    select: {
      user: {
        select: {
          notificationSubscription: true,
          timeZone: true,
          RoutineItem: true,
        },
      },
    },
  });

  // Make sure that user actually has routines
  subscriptions = subscriptions.filter(
    (subscription) => subscription.user.RoutineItem.length > 0
  );

  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );

  // For each user
  for (let i = 0; i < subscriptions.length; i++) {
    const subscription = subscriptions[i];
    const { notificationSubscription, timeZone, RoutineItem }: any =
      subscription.user;

    // Current time in user's timezone
    const currentTimeInUserTimeZone = dayjs().tz(timeZone).hour();

    const currentRoutine = RoutineItem.find(
      (routine: RoutineItem) => routine.timeOfDay === currentTimeInUserTimeZone
    );

    if (currentRoutine) {
      try {
        const templates = [
          "Embrace the challenges ahead, for they hold the key to your growth.",
          "Today is your opportunity to write a new chapter in your success story.",
          "Let your dreams take flight, as the possibilities are endless.",
          "Dare to be extraordinary and watch your aspirations become reality.",
          "Every setback is a setup for a comeback. Keep pushing forward!",
          "Believe in yourself, for you possess the power to achieve greatness.",
          "Unlock your potential and discover the extraordinary within you.",
          "Rise above the ordinary and strive for the extraordinary.",
          "Turn your obstacles into stepping stones and conquer new heights.",
          "Your journey begins now, with every step you take towards your dreams.",
        ];
        const random = templates[Math.floor(Math.random() * templates.length)];

        await DispatchNotification({
          title: currentRoutine.stepName.trim(),
          icon: "https://assets.dysperse.com/v5/ios/192.png",
          body: random,
          actions: [
            {
              title: "👉 Finish daily goal",
              action: `goal-${currentRoutine.id}`,
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
