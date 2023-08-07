const webPush = require("web-push");
import { DispatchNotification } from "@/lib/server/notification";
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
  // Select user's push notification subscription URL, also asking one of their incompleted goals.
  let subscriptions = await prisma.notificationSettings.findMany({
    where: {
      AND: [
        { user: { notificationSubscription: { contains: "{" } } },
        { todoListUpdates: true },
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
          id: true,
          timeZone: true,
          properties: {
            select: { propertyId: true },
            where: { selected: true },
          },
        },
      },
    },
  });

  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );

  // For each user
  for (let i = 0; i < subscriptions.length; i++) {
    try {
      const subscription = subscriptions[i];
      const { notificationSubscription, timeZone }: any = subscription.user;
      const propertyId = subscription.user.properties[0].propertyId;

      const currentTimeInUserTimeZone = dayjs().tz(timeZone).toDate();

      // notifies users ~5 mins before event starts
      const notificationBuffer = dayjs()
        .tz(timeZone)
        .add(5, "minutes")
        .toDate();

      const tasks = await prisma.task.findMany({
        where: {
          AND: [
            { propertyId },
            { due: { gte: currentTimeInUserTimeZone } },
            { due: { lte: notificationBuffer } },
            {
              NOT: {
                AND: [
                  { column: { board: { public: false } } },
                  {
                    column: {
                      board: { user: { id: { not: subscription.user.id } } },
                    },
                  },
                ],
              },
            },
          ],
        },
        select: {
          name: true,
          id: true,
          pinned: true,
          due: true,
        },
      });

      for (let i = 0; i < tasks.length; i++) {
        const task = tasks[i];
        try {
          await DispatchNotification({
            subscription: notificationSubscription,
            title: task.name,
            body: dayjs(task.due).fromNow(),
          });
        } catch (e) {
          console.log(e);
          console.log("Error while dispatching notification");
        }
      }
    } catch (e) {
      console.log("Error while fetching tasks");
    }
  }

  res.status(200).json({ message: "Notification sent" });
};

export default Notification;
