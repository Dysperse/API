import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import ical from "ical";

dayjs.extend(utc);
dayjs.extend(timezone);

function extractTextInBrackets(text: string): string {
  let match = text.match(/\[(.*?)\]/);
  return match ? match[1] : "";
}

const handler = async (req, res) => {
  try {
    let data = await prisma.integration.findFirstOrThrow({
      where: {
        AND: [
          { name: "Canvas LMS" },
          { propertyId: req.query.property },
          { boardId: req.query.boardId },
        ],
      },
      take: 1,
    });

    await prisma.integration.update({
      where: { id: data.id },
      data: { lastSynced: dayjs().tz(req.query.timeZone).toDate() },
    });

    const inputParams = JSON.parse(data.inputParams);
    const calendar = await fetch(inputParams["Canvas feed URL"]).then((res) =>
      res.text()
    );

    const parsed = ical.parseICS(calendar);

    // Let's create some columns!
    let columns: string[] = [];
    for (const event in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, event)) {
        const ev = parsed[event];

        const course: string = ev.summary;
        columns.push(extractTextInBrackets(course));
      }
    }

    columns = [...new Set(columns)];

    // Now add the tasks
    for (const event in parsed) {
      if (Object.prototype.hasOwnProperty.call(parsed, event)) {
        const item = parsed[event];

        const taskId = `${data.boardId}-${item.uid}`;
        const columnId = `${data.boardId}-${extractTextInBrackets(
          item.summary
        )}`;

        let due: string | Date = new Date();

        if (item.start || item.dtstamp || item.end)
          due = (item.start || item.dtstamp || item.end).toISOString();

        if (item.start.dateOnly) {
          due = dayjs(due)
            .tz(req.query.timeZone)
            .set("hour", 23)
            .set("minute", 59)
            .add(1, "day")
            .toISOString();
        }

        if (req.query.vanishingTasks === "true") {
          try {
            const currentTimeInTimeZone = dayjs().tz(req.query.timeZone);
            const dueDateInTimeZone = dayjs(due).tz(req.query.timeZone);
            const diff = currentTimeInTimeZone.diff(dueDateInTimeZone, "day");

            if (diff >= 14) {
              continue;
            }
          } catch (e) {
            console.error(e);
          }
        }

        let name: string = item.summary
          ?.toString()
          .split(" [")[0]
          .replaceAll("\\", "");

        if (name.includes("(")) {
          name = name.split("(")[0];
        }

        let description: null | string = null;
        let location: null | string = null;

        if (item.description) {
          description = item.description;
        }
        if (item.url) {
          location = item.url?.val;
        }

        if (name) {
          const d = await prisma.task.upsert({
            where: {
              id: taskId,
            },
            update: {
              name,
              // description,
              where: location,
              ...(due && { due }),
              createdBy: {
                connect: {
                  identifier: req.query.user,
                },
              },
            },
            create: {
              createdBy: {
                connect: {
                  identifier: req.query.user,
                },
              },
              property: {
                connect: { id: req.query.property },
              },
              notifications: [10],
              id: taskId,
              name,
              where: location,
              ...(due && { due }),
              description,

              column: {
                connectOrCreate: {
                  where: {
                    id: columnId,
                  },
                  create: {
                    emoji: "1f3af",
                    name: extractTextInBrackets(item.summary),
                    id: columnId,
                    board: {
                      connect: {
                        id: data.boardId as string,
                      },
                    },
                  },
                },
              },
            },
          });
        }
      }
    }

    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
};
export default handler;
