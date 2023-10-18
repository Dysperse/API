const webPush = require("web-push");
import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

const Notification = async (req, res) => {
  if (
    req.headers.authorization !== `Bearer ${process.env.CRON_API_KEY}` &&
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
          Task: {
            select: {
              id: true,
              name: true,
              due: true,
              notifications: true,
              image: true,
            },
            where: {
              AND: [
                { notifications: { isEmpty: false } },
                { completed: false },
                { dateOnly: false },
              ],
            },
          },
          timeZone: true,
        },
      },
    },
  });

  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );

  for (const _i in subscriptions) {
    const subscription = subscriptions[_i];

    const { notificationSubscription, timeZone }: any = subscription.user;

    const time = dayjs().tz(timeZone);

    for (const i in subscription.user.Task) {
      const task = subscription.user.Task[i];
      let notifications = task.notifications.sort().reverse();

      const due = dayjs(task.due).tz(timeZone);
      const diff = dayjs(due).diff(time, "minute");

      // If the largetst element in the notifications array is greater than or equal to the time, send the notification
      if (Math.max(...notifications) >= diff && diff >= 0) {
        await DispatchNotification({
          title: task.name,
          icon: "https://assets.dysperse.com/v9/ios/192.png",
          body: `In ${diff} minutes`,
          actions: [
            {
              title: "✅ Complete",
              action: `task-complete-${task.id}`,
            },
            {
              title: "👀 View",
              action: `task-view-${task.id}`,
            },
          ],
          subscription: notificationSubscription,
        });

        await prisma.task.update({
          where: {
            id: task.id,
          },
          data: {
            notifications: notifications
              .filter((n) => n !== Math.max(...notifications))
              .sort()
              .reverse(),
          },
        });
      }
    }
  }
  res.json({ success: true });
};

export default Notification;
