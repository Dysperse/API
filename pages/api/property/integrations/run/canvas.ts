import ICalParser from "ical-js-parser";
import { prisma } from "../../../../../lib/server/prisma";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

function parseICalDate(icalDateStr) {
  // Split the iCal date string into its components
  const year = icalDateStr.substr(0, 4);
  const month = parseInt(icalDateStr.substr(4, 2)) - 1; // Note: JavaScript months are zero-indexed
  const day = icalDateStr.substr(6, 2);
  const hour = icalDateStr.substr(9, 2);
  const minute = icalDateStr.substr(11, 2);
  const second = icalDateStr.substr(13, 2);

  // Create a new Date object with the parsed components
  return new Date(year, month, day, hour, minute, second);
}

function extractTextInBrackets(text: any) {
  let match = text.match(/\[(.*?)\]/);
  return match ? match[1] : null;
}

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  let data = await prisma.integration.findMany({
    where: {
      AND: [
        { name: "Canvas LMS" },
        {
          propertyId: req.query.property,
        },
        {
          boardId: req.query.boardId,
        },
      ],
    },
    take: 1,
  });
  if (!data[0]) {
    res.json({ error: true, message: "Integration does not exist" });
  }
  const data1: any = data[0];

  const inputParams = JSON.parse(data1.inputParams);
  const calendar = await fetch(inputParams["Canvas feed URL"]).then((res) =>
    res.text()
  );

  const parsed: any = ICalParser.toJSON(calendar).events;
  let columns: any = [];

  for (let i = 0; i < parsed.length; i++) {
    const course: any = parsed[i].summary;
    columns.push(extractTextInBrackets(course) as any);
  }

  columns = [...new Set(columns)];

  // Now add the tasks
  for (let i = 0; i < parsed.length; i++) {
    const item = parsed[i];
    const taskId = `${data1.boardId}-${item.uid}`;
    const columnId = `${data1.boardId}-${extractTextInBrackets(item.summary)}`;

    const due = (item.dtstamp || item.dtstart || item.dtend || { value: null })
      .value;

    let name: any = item.summary
      ?.toString()
      .split(" [")[0]
      .replaceAll("\\", "");

    if (name.includes("(")) {
      name = name.split("(")[0];
    }
    const d = await prisma.task.upsert({
      where: {
        id: taskId,
      },
      update: {
        name,
        ...(due && {
          due: parseICalDate(due),
        }),
      },
      create: {
        property: {
          connect: {
            id: req.query.property,
          },
        },
        id: taskId,
        name,
        ...(due && {
          due: parseICalDate(due),
        }),
        description: item.url,
        column: {
          connectOrCreate: {
            where: {
              id: columnId,
            },
            create: {
              emoji:
                "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f3af.png",
              name: extractTextInBrackets(item.summary),
              id: columnId,
              board: {
                connect: {
                  id: data1.boardId,
                },
              },
            },
          },
        },
      },
    });
  }

  res.json(data);
};
export default handler;
