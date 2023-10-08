import { prisma } from "@/lib/server/prisma";
import { sessionData } from "@/pages/api/session";
import { googleClient } from "@/pages/api/user/google/redirect";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

export default async function handler(req, res) {
  const session = await sessionData(req.cookies.token);

  let integration = await prisma.integration.findFirstOrThrow({
    where: {
      AND: [
        { name: "Google Calendar" },
        { propertyId: req.query.property },
        { boardId: req.query.boardId },
      ],
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
      user: { identifier: session.user.identifier },
    },
    select: { google: true },
  });

  const oauth2Client = googleClient(req);
  const tokenObj: any = data.google;

  oauth2Client.setCredentials(tokenObj);

  await prisma.integration.update({
    where: { id: integration.id },
    data: { lastSynced: dayjs().tz(req.query.timeZone).toDate() },
  });

  const taskTemplate = (event, columnId, reminders) => ({
    id: "dysperse-gcal-integration-task-" + event.id,
    name: event.summary,
    where: event.hangoutLink || event.location || event.htmlLink,
    lastUpdated: dayjs(event.updated).tz(req.query.timeZone).toDate(),
    due: dayjs(event.start?.dateTime).tz(req.query.timeZone).toDate(),
    property: { connect: { id: req.query.property } },
    createdBy: {
      connect: { identifier: req.query.userIdentifier },
    },
    column: { connect: { id: columnId } },
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
  if (tokenObj.expiry_date < Date.now()) {
    console.log(tokenObj);
    // Refresh the access token
    oauth2Client.refreshAccessToken(async function (err, newAccessToken) {
      console.log(err, newAccessToken);

      if (err) {
        console.log(err);
        res.json(err);
        return;
      } else {
        await prisma.profile.update({
          where: {
            userId: req.query.userIdentifier,
          },
          data: {
            google: newAccessToken,
          },
        });
        oauth2Client.setCredentials(newAccessToken);
      }
    });
  }

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
          board: { connect: { id: req.query.boardId } },
        },
        create: {
          id: columnId,
          emoji: "1f3af",
          name: calendar.summary,
          board: { connect: { id: req.query.boardId } },
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
    } catch (e) {
      console.log(e);
    }
  }

  res.json({ success: true });
}
