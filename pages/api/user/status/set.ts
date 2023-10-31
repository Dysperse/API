import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  try {
    validateParams(req.query, ["userIdentifier", "email"]);

    console.log("recieved!");

    const until = req.query.until
      ? dayjs(req.query.start)
          .tz(req.query.timeZone)
          .add(req.query.until, "minutes")
          .toDate()
      : null;

    const status = {
      status: req.query.status,
      started: new Date(req.query.start),
      until,
      text: req.query.text,
      emoji: req.query.emoji,
      user: { connect: { identifier: req.query.userIdentifier } },
    };

    await prisma.status.upsert({
      where: {
        userId: req.query.userIdentifier,
      },
      update: status,
      create: status,
    });

    if (req.query.notifyFriendsForStatusUpdates === "true") {
      const users = await prisma.notificationSettings.findMany({
        where: {
          AND: [
            {
              user: {
                followers: { some: { follower: { email: req.query.email } } },
              },
            },
          ],
        },
        select: {
          user: {
            select: {
              notifications: { select: { pushSubscription: true } },
            },
          },
        },
      });

      users.forEach(async ({ user }) => {
        if (user.notifications?.pushSubscription)
          await DispatchNotification({
            subscription: user.notifications?.pushSubscription as any,
            title: `${JSON.parse(req.query.profile)?.name.trim()} is ${
              req.query.status
            } until ${dayjs(dayjs(until).tz(req.query.timeZone)).format(
              "h:mm A"
            )}`,
            body: "Tap to view status update",
            icon: JSON.parse(req.query.profile)?.Profile?.picture,
          });
      });
    }

    res.json({ success: true });
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}
