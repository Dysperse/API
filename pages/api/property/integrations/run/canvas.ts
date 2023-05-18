import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
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
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    let data = await prisma.integration.findMany({
      where: {
        AND: [
          { name: "Canvas LMS" },
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

        const taskId = `${data1.boardId}-${item.uid}`;
        const columnId = `${data1.boardId}-${extractTextInBrackets(
          item.summary
        )}`;

        let due = new Date();

        if (item.start || item.end || item.dtstamp)
          due = (item.start || item.end || item.dtstamp).toISOString();

        let name: string = item.summary
          ?.toString()
          .split(" [")[0]
          .replaceAll("\\", "");

        if (name.includes("(")) {
          name = name.split("(")[0];
        }

        let description: null | string = null;
        if (item.description) {
          description = item.description;
          if (item.url) {
            description = `${item.description}\n\nOriginal link: ${item.url}`;
          }
        }

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

        if (name) {
          await prisma.task.upsert({
            where: {
              id: taskId,
            },
            update: {
              name,
              description,
              ...(due && { due }),
            },
            create: {
              property: {
                connect: { id: req.query.property },
              },
              id: taskId,
              name,
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
                        id: data1.boardId as string,
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
    res.json({ error: e.message });
  }
};
export default handler;
