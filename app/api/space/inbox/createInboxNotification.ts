import { handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
const webPush = require("web-push");

export const createInboxNotification = async (
  who: string,
  what: string,
  when: Date,
  propertyId: string
) => {
  try {
    const data = await prisma.inboxItem.create({
      data: {
        who: who,
        what: what,
        when: when,
        property: { connect: { id: propertyId } },
      },
      include: { property: true },
    });

    // Fetch all members of the property
    let members = await prisma.propertyInvite.findMany({
      where: { propertyId },
      select: {
        user: {
          select: {
            identifier: true,
            notifications: { select: { pushSubscription: true } },
          },
        },
      },
    });

    members = Object.values(
      members.reduce((acc, item) => {
        acc[item.user.identifier] = item;
        return acc;
      }, {})
    );

    // Send a notification to each member
    for (let i = 0; i < members.length; i++) {
      const pushSubscription = members[i].user?.notifications?.pushSubscription;
      if (pushSubscription) {
        webPush.setVapidDetails(
          `mailto:${process.env.WEB_PUSH_EMAIL}`,
          process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
          process.env.WEB_PUSH_PRIVATE_KEY
        );

        webPush.sendNotification(
          pushSubscription,
          JSON.stringify({
            title: `${who} has edited your group`,
            body: `${who} ${what}`,
            actions: [{ title: "⚡ View", action: "viewGroupModification" }],
          })
        );
      }
    }

    return data;
  } catch (e) {
    return handleApiError(e);
  }
};
