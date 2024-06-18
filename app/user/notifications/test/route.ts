import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NotificationSubscription } from "@prisma/client";
import { NextRequest } from "next/server";
import webPush from "web-push";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

class Notification {
  subscription: NotificationSubscription;
  data: {
    title: string;
    body: string;
    data: Record<string, any>;
  };

  constructor(subscription: any, data: any) {
    this.subscription = subscription;
    this.data = data;

    if (this.subscription.type === "WEB") {
      webPush.setVapidDetails(
        `mailto:${process.env.WEB_PUSH_EMAIL}`,
        process.env.WEB_PUSH_PUBLIC_KEY,
        process.env.WEB_PUSH_PRIVATE_KEY
      );
    }
  }

  async send(): Promise<unknown> {
    if (this.subscription.type === "EXPO") {
      const message = {
        to: this.subscription.tokens,
        sound: "default",
        title: "well, hello there 👋",
        body: "#dysperse notifications are cool (and so are you! 🤭)",
        data: { someData: "goes here" },
      };

      const res = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Accept-encoding": "gzip, deflate",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      const data = await res.json();
      return data;
    } else if (this.subscription.type === "WEB") {
      const response = await webPush.sendNotification(
        this.subscription.tokens,
        JSON.stringify(this.data)
      );
      console.log(response);
      return response;
    } else {
      throw new Error("Invalid subscription type. Must be of type EXPO or WEB");
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const subscriptions = await prisma.notificationSubscription.findMany({
      where: { userId },
    });

    for (const subscription of subscriptions) {
      new Notification(subscription, {
        title: "well, hello there 👋",
        body: "#dysperse notifications are cool (and so are you! 🤭",
        data: { someData: "goes here" },
      }).send();
    }

    return Response.json(subscriptions);
  } catch (e) {
    return handleApiError(e);
  }
}
