import { prisma } from "@/lib/prisma";
import { NotificationSettings, NotificationSubscription } from "@prisma/client";
import { ExpoPushMessage } from "expo-server-sdk";
import webPush from "web-push";

export class Notification {
  identifier: keyof NotificationSettings | "FORCE";
  data: Omit<ExpoPushMessage, "to">;

  constructor(
    identifier: keyof NotificationSettings | "FORCE",
    data: Omit<ExpoPushMessage, "to">
  ) {
    this.identifier = identifier;
    this.data = data;
  }

  /**
   * Dispatch the notification to all of the user's devices
   */
  async dispatch(userId): Promise<unknown> {
    const data = await prisma.notificationSubscription.findMany({
      where: {
        AND: [
          { OR: [{ userId }, { user: { email: userId } }] },
          this.identifier === "FORCE"
            ? { id: { contains: "-" } }
            : { [this.identifier]: true },
        ],
      },
    });

    return await Promise.allSettled(
      data.map((subscription) => {
        return new Notification("FORCE", this.data).send(subscription);
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
    } else if (subscription.type === "FCM") {
      await fetch(
        "https://fcm.googleapis.com/v1/projects/dysperse/messages:send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ya29.a0AcM612yJZZWuFcySlBI0DSA0PtazP7wHVwsOxDkmMhR6PoniJRL1oPV5_Z6qzXlOVbhx5a4agTT646Ccj0bagArm_g-gebpC6Y4S4J_DYDcJkV8c831Zb3XwbQk3P1D90iNqhUVYHUfFVn1HPW2jc8ifPaKjzJnu7DZdwtSFaCgYKAZwSARISFQHGX2MiX7OSpPd_v0TTZHfBKAhB-g0175`,
          },
          body: JSON.stringify({
            message: {
              token: subscription.tokens,
              notification: {
                title: this.data.title,
                body: this.data.body,
              },
            },
          }),
        }
      );
    } else {
      throw new Error(
        "Invalid subscription type. Must be of type EXPO | WEB | FCM"
      );
    }
  }
}
