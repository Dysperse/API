import { prisma } from "@/lib/prisma";
import { NotificationSubscription } from "@prisma/client";
import { ExpoPushMessage } from "expo-server-sdk";
import webPush from "web-push";

export class Notification {
  data: Omit<ExpoPushMessage, "to">;

  constructor(data: Omit<ExpoPushMessage, "to">) {
    this.data = data;
  }

  /**
   * Dispatch the notification to all of the user's devices
   */
  async dispatch(userId): Promise<unknown> {
    const data = await prisma.notificationSubscription.findMany({
      where: { OR: [{ userId }, { user: { email: userId } }] },
    });

    return await Promise.allSettled(
      data.map((subscription) => {
        return new Notification(this.data).send(subscription);
      })
    );
  }

  async send(subscription: NotificationSubscription): Promise<unknown> {
    if (subscription.type === "EXPO") {
      console.log(this.data);
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: subscription.tokens,
          ...this.data,
        }),
      });

      console.log(res);

      const data = await res.json();
      return data;
    } else if (subscription.type === "WEB") {
      webPush.setVapidDetails(
        `mailto:${process.env.WEB_PUSH_EMAIL}`,
        process.env.WEB_PUSH_PUBLIC_KEY,
        process.env.WEB_PUSH_PRIVATE_KEY
      );
      const response = await webPush.sendNotification(
        subscription.tokens,
        JSON.stringify(this.data)
      );
      console.log(response);
      return response;
    } else {
      throw new Error("Invalid subscription type. Must be of type EXPO or WEB");
    }
  }
}
