import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";
const webPush = require("web-push");

export const createInboxNotification = async (
  who: string,
  what: string,
  when: Date,
  propertyId: string,
  accessToken: string,
  req,
  res
) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.inboxItem.create({
    data: {
      who: who,
      what: what,
      when: when,
      property: {
        connect: { id: propertyId },
      },
    },
    include: {
      property: true,
    },
  });

  // Fetch all members of the property
  const members = await prisma.propertyInvite.findMany({
    where: {
      propertyId,
    },
    select: {
      user: {
        select: {
          notificationSubscription: true,
        },
      },
    },
  });

  // Send a notification to each member
  for (let i = 0; i < members.length; i++) {
    const { notificationSubscription } = members[i].user;
    if (notificationSubscription) {
      webPush.setVapidDetails(
        `mailto:${process.env.WEB_PUSH_EMAIL}`,
        process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
        process.env.WEB_PUSH_PRIVATE_KEY
      );

      webPush
        .sendNotification(
          JSON.parse(notificationSubscription) as any,
          JSON.stringify({
            title: `${who} has edited your group`,
            body: `${who} ${what}`,
            actions: [{ title: "⚡ View", action: "viewGroupModification" }],
          })
        )
        .then(() => console.log("Sent"))
        .catch((err) => {
          console.log(err);
          console.log("Error");
        });
    }
  }

  return data;
};

export default function handler(req, res) {
  res.status(403).json({
    message: "Forbidden",
  });
}
