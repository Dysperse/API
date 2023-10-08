const webPush = require("web-push");
import { prisma } from "@/lib/server/prisma";

export namespace Dysperse {
  export interface Notification {
    subscription: string;
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
  icon = "https://assets.dysperse.com/v8/ios/192.png",
}: Dysperse.Notification) => {
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    await webPush.sendNotification(
      JSON.parse(subscription),
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

export const DispatchGroupNotification = async (
  propertyId,
  accessToken,
  options
) => {
  try {
    const members = await prisma.notificationSettings.findMany({
      where: {
        AND: [
          { boards: true },
          {
            user: {
              AND: [
                {
                  properties: {
                    some: {
                      AND: [{ propertyId }, { accessToken }],
                    },
                  },
                },
                { notificationSubscription: { not: null } },
              ],
            },
          },
        ],
      },
      include: {
        user: {
          select: {
            notificationSubscription: true,
          },
        },
      },
    });

    for (const member of members) {
      await DispatchNotification({
        subscription: member.user.notificationSubscription,
        ...options,
      });
    }

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};
