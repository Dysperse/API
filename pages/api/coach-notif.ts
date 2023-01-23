const webPush = require("web-push");
import { prisma } from "../../lib/prismaClient";

const Notification = async (req, res) => {
  if (req.method === "POST") {
    if (
      req.headers.authorization !== `Bearer ${process.env.COACH_CRON_API_KEY}`
    ) {
      res.status(401).json({
        error: "Unauthorized",
      });
      return;
    }
    // Select user's push notification subscription URL, also asking one of their incompleted goals.
    let users = await prisma.user.findMany({
      select: {
        notificationSubscription: true,
        RoutineItem: {
          select: {
            completed: true,
          },
          where: {
            completed: true,
          },
          take: 1,
        },
      },
    });

    // Make sure that user actually has goals (which aren't completed!)
    users = users.filter((user) => user.RoutineItem.length === 1);

    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    // For each user
    for (let i = 0; i < users.length; i++) {
      const user = users[i];
      const { notificationSubscription }: any = user;
      //   Send notification
      webPush
        .sendNotification(
          JSON.parse(notificationSubscription) as any,
          JSON.stringify({
            title: "Let's work on your goals!",
            body: "Tap to start your daily routine",
            actions: [
              {
                title: "⚡ Start my daily routine",
                action: "startDailyRoutine",
              },
            ],
          })
        )
        .catch((err) => console.log(err));
    }

    res.status(200).json({ message: "Notification sent" });
  }
};

export default Notification;
