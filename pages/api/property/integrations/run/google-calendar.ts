import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import ical from "ical";

dayjs.extend(utc);
dayjs.extend(timezone);

const handler = async (req, res) => {
  try {
    let data = await prisma.integration.findMany({
      where: {
        AND: [
          { name: "Google Calendar" },
          { propertyId: req.query.property },
          { boardId: req.query.boardId },
        ],
      },
      take: 1,
    });

    if (!data[0]) {
      res.json({ error: true, message: "Integration does not exist" });
    }

    const data1 = data[0];

    const inputParams = JSON.parse(data1.inputParams);
    console.log(inputParams);
    const calendar = await fetch(
      decodeURIComponent(inputParams["Secret address in iCal format"]),
    ).then((res) => res.text());

    const parsed = ical.parseICS(calendar);
    const events = Object.keys(parsed);

    const columnId = "integrations-calendar-" + data1.id;

    for (let i = 0; i < events.length; i++) {
      const id = `integrations-calendar-${events[i]}`;
      const {
        summary,
        description,
        location,
        start,
        id: _id,
      } = parsed[events[i]];

      const due = start ? dayjs(start).utc().format() : null;

      if (!summary || !due) continue;
      if (_id && _id.toString().includes("dysperse")) continue;

      if (req.query.vanishingTasks === "true") {
        try {
          const currentTimeInTimeZone = dayjs().tz(req.query.timeZone);
          const dueDateInTimeZone = dayjs(due).tz(req.query.timeZone);
          const diff = currentTimeInTimeZone.diff(dueDateInTimeZone, "day");

          if (diff >= 14) continue;
        } catch (e) {
          console.error(e);
        }
      }

      await prisma.task.upsert({
        where: {
          id: id,
        },
        update: {
          name: summary,
          description,
          where: location,
          ...(due && { due }),
        },
        create: {
          id,
          name: summary,
          where: location,
          description,
          ...(due && { due }),
          property: { connect: { id: req.query.property } },
          column: {
            connectOrCreate: {
              where: { id: columnId },
              create: {
                emoji: "1f3af",
                name: "",
                id: columnId,
                board: { connect: { id: data1.boardId as string } },
              },
            },
          },
        },
      });
    }

    res.json({ parsed });
  } catch (error: any) {
    console.log(error);
    res.json({ error: error.message });
  }
};
export default handler;
