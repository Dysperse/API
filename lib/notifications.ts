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

  static #accessToken = null;
  static #setAccessToken = async () => {
    const auth = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        refresh_token: process.env.FCM_REFRESH_TOKEN,
        grant_type: "refresh_token",
      }),
    }).then((res) => res.json());

    // Set the access token so it can be used later in this class
    Notification.#accessToken = auth.access_token;
  };

  /**
   * Dispatch the notification to all of the user's devices
   */
  async dispatch(userId): Promise<unknown> {
    const data = await prisma.notificationSubscription.findMany({
      where: {
        AND: [
          { OR: [{ userId }, { user: { email: userId } }] },
          {
            user: {
              notificationSettings:
                this.identifier === "FORCE"
                  ? { id: { contains: "-" } }
                  : { [this.identifier]: true },
            },
          },
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
      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: subscription.tokens,
          priority: "high",
          ...this.data,
        }),
      }).then((res) => res.json());

      if (res?.data?.status === "ok") {
        console.log(
          `🔔 ${subscription.type} Notification successfully sent to NotificationSubscription[${subscription.id}]`
        );
        return true;
      }
    } else if (subscription.type === "WEB") {
      webPush.setVapidDetails(
        `mailto:${process.env.WEB_PUSH_EMAIL}`,
        process.env.WEB_PUSH_PUBLIC_KEY,
        process.env.WEB_PUSH_PRIVATE_KEY
      );
      const response = await webPush.sendNotification(
        subscription.tokens,
        JSON.stringify(this.data),
        { urgency: "high" }
      );
      if (response.statusCode === 201) {
        {
          console.log(
            `🔔 ${subscription.type} Notification successfully sent to NotificationSubscription[${subscription.id}]`
          );
          return true;
        }
      }
      return response;
    } else if (subscription.type === "FCM") {
      // in case we need to get another refresh token in the future, here's the authorization URL (copy and paste in browser)
      // https://accounts.google.com/o/oauth2/auth?client_id=990040256661-u5ke19h4s0dklnp7rietlg9u264fbn34.apps.googleusercontent.com&redirect_uri=http://localhost:3000&scope=https://www.googleapis.com/auth/firebase.messaging&response_type=code&access_type=offline&prompt=consent

      if (!Notification.#accessToken) {
        await Notification.#setAccessToken();
      }

      const accessToken = Notification.#accessToken;

      const res = await fetch(
        "https://fcm.googleapis.com/v1/projects/dysperse/messages:send",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            message: {
              token: subscription.tokens,
              notification: {
                title: this.data.title,
                body: this.data.body,
              },
              // high priority
              android: {
                priority: "high",
              },
              // high priority
              apns: {
                headers: {
                  "apns-priority": "5",
                },
              },
              // high priority
              webpush: {
                headers: {
                  Urgency: "high",
                },
              },
            },
          }),
        }
      ).then((res) => res.json());
      if (res.name) {
        {
          console.log(
            `🔔 ${subscription.type} Notification successfully sent to NotificationSubscription[${subscription.id}]`
          );
          return true;
        }
      }
    } else {
      throw new Error(
        "Invalid subscription type. Must be of type EXPO | WEB | FCM"
      );
    }
  }
}
