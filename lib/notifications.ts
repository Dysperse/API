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
      }).then((res) => res.json());

      if (res?.data?.status === "ok") {
        console.log(
          `🔔 ${subscription.type} Notification successfully sent to NotificationSubscription[${subscription.id}]`
        );
      }
      return res;
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
      if (response.statusCode === 201) {
        console.log(
          `🔔 ${subscription.type} Notification successfully sent to NotificationSubscription[${subscription.id}]`
        );
      }
      return response;
    } else if (subscription.type === "FCM") {
      const refreshToken =
        "1//06LN_x2nmQITvCgYIARAAGAYSNwF-L9IrccDxK5sBLAm5kbs8hPShNFsSGlHJFOT9CUtnu3IlnRLW82hym1SHO-rp7yTA5N7RZ5E";

      // Refresh the access token and get it
      const auth = await fetch("https://oauth2.googleapis.com/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: "refresh_token",
        }),
      }).then((res) => res.json());

      const res = await fetch(
        "https://fcm.googleapis.com/v1/projects/dysperse/messages:send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth.access_token}`,
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
      ).then((res) => res.json());
      if (res.name) {
        console.log(
          `🔔 ${subscription.type} Notification successfully sent to NotificationSubscription[${subscription.id}]`
        );
      }
    } else {
      throw new Error(
        "Invalid subscription type. Must be of type EXPO | WEB | FCM"
      );
    }
  }
}
