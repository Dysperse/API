import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function GET() {
  const sessionToken = getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);
  try {
    const data = await prisma.status.findFirst({
      where: {
        userId: userIdentifier,
      },
      select: {
        status: true,
        id: true,
        started: true,
        text: true,
        until: true,
        emoji: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);
    const _until = await getApiParam(req, "until", false);
    const start = await getApiParam(req, "start", true);
    const timeZone = await getApiParam(req, "timeZone", false);
    const text = await getApiParam(req, "text", false);
    const email = await getApiParam(req, "email", false);
    const profile = await getApiParam(req, "profile", false);
    const emoji = await getApiParam(req, "emoji", false);
    const _status = await getApiParam(req, "status", true);
    const notifyFriendsForStatusUpdates = await getApiParam(
      req,
      "notifyFriendsForStatusUpdates",
      false
    );

    const until = _until
      ? dayjs(start).tz(timeZone).add(_until, "minutes").toDate()
      : null;

    const status = {
      status: _status,
      started: new Date(start),
      until,
      text: text,
      emoji: emoji,
      user: { connect: { identifier: userIdentifier } },
    };

    await prisma.status.upsert({
      where: {
        userId: userIdentifier,
      },
      update: status,
      create: status,
    });

    if (notifyFriendsForStatusUpdates === "true") {
      const users = await prisma.notificationSettings.findMany({
        where: {
          AND: [
            {
              user: {
                followers: { some: { follower: { email } } },
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
            title: `${JSON.parse(
              profile
            )?.name.trim()} is ${_status} until ${dayjs(
              dayjs(until).tz(timeZone)
            ).format("h:mm A")}`,
            body: "Tap to view status update",
            icon: JSON.parse(profile)?.Profile?.picture,
          });
      });
    }

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
