import { googleClient } from "@/app/api/user/google/redirect/route";
import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);

export async function GET(req: NextRequest) {
  const sessionId = await getSessionToken();
  const { spaceId, userIdentifier } = await getIdentifiers(sessionId);

  const boardId = getApiParam(req, "boardId", false);
  const timeZone = getApiParam(req, "timeZone", true);
  const offset = getApiParam(req, "offset", true);
  let integration = await prisma.integration.findFirstOrThrow({
    where: {
      AND: [{ name: "Google Calendar" }, { propertyId: spaceId }, { boardId }],
    },
    select: {
      id: true,
      user: {
        select: { email: true },
      },
    },
  });

  const data = await prisma.profile.findFirstOrThrow({
    where: {
      user: { identifier: userIdentifier },
    },
    select: { google: true },
  });

  const oauth2Client = googleClient(req);
  const tokenObj: any = data.google;

  oauth2Client.setCredentials(tokenObj);

  await prisma.integration.update({
    where: { id: integration.id },
    data: { lastSynced: dayjs().tz(timeZone).toDate() },
  });

  const taskTemplate = (event, columnId, reminders) => ({
    id: "dysperse-gcal-integration-task-" + event.id,
    name: event.summary,
    dateOnly: false,
    where: event.hangoutLink || event.location || event.htmlLink,
    lastUpdated: dayjs(event.updated)
      .utc()
      .utcOffset(parseInt(offset) / 60)
      .toDate(),
    due: dayjs(event.start?.dateTime)
      .utc()
      .utcOffset(parseInt(offset) / 60)
      .toDate(),
    property: { connect: { id: spaceId } },
    createdBy: {
      connect: { identifier: userIdentifier },
    },
    column: { connect: { id: columnId } },
    ...(event?.recurrence?.[0] && {
      recurrenceRule: event?.recurrence?.[0],
    }),
    notifications: [
      ...new Set(
        [
          ...reminders,
          ...(event?.reminders?.overrides || []).map(({ minutes }) => minutes),
        ]
          .filter((e) => e)
          .sort()
      ),
    ],
  });
  if (!tokenObj) throw new Error("Token not found");

  const calendars = await fetch(
    "https://www.googleapis.com/calendar/v3/users/me/calendarList",
    {
      headers: {
        Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
      },
    }
  ).then((res) => res.json());

  // Loop through calendars
  for (const calendar of calendars.items) {
    if (calendar.summary === "Dysperse") continue;
    let { items } = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/${calendar.id}/events`,
      {
        headers: {
          Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
        },
      }
    ).then((res) => res.json());

    if (!items) continue;

    const columnId = "dys-gcal-integration-" + calendar.id;
    items = items.filter((event) => !event?.iCalUID?.includes("dysperse-task"));

    const reminders = calendar.defaultReminders?.map((e) => e.minutes) || [10];
    try {
      prisma.column.upsert({
        where: {
          id: columnId,
        },
        update: {
          board: { connect: { id: boardId } },
        },
        create: {
          id: columnId,
          emoji: "1f3af",
          name: calendar.summary,
          board: { connect: { id: boardId } },
        },
      });

      // Loop through the calendar events
      for (const item of items) {
        const taskId = "dysperse-gcal-integration-task-" + item.id;

        await prisma.task.upsert({
          where: {
            id: taskId,
          },
          update: taskTemplate(item, columnId, reminders),
          create: taskTemplate(item, columnId, reminders),
        });
      }
    } catch (e) {}
  }

  return Response.json({ success: true });
}
