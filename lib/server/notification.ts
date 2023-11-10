const webPush = require("web-push");
import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@prisma/client";

export namespace Dysperse {
  export interface Notification {
    subscription: any;
    title: string;
    body?: string;
    actions?: { title: string; action: string }[];
    icon?: string;
  }
}

export const DispatchNotification = async ({
  subscription,
  title,
  body,
  actions,
  icon = "https://assets.dysperse.com/v10/ios/192.png",
}: Dysperse.Notification) => {
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    await webPush.sendNotification(
      typeof subscription === "string"
        ? JSON.parse(subscription)
        : subscription,
      JSON.stringify({
        title: title,
        body,
        actions: actions ?? [{ title: "⚡ View", action: "view" }],
        icon,
      })
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};

export const DispatchGroupNotification = async (propertyId, options) => {
  try {
    let members = await prisma.notificationSettings.findMany({
      where: {
        AND: [
          { pushSubscription: { not: Prisma.AnyNull } },
          {
            user: {
              AND: [{ properties: { some: { propertyId } } }],
            },
          },
        ],
      },
    });

    for (const member of members) {
      await DispatchNotification({
        subscription: member.pushSubscription,
        ...options,
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
