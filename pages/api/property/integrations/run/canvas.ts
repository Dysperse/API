import iCalDateParser from "ical-date-parser";
import ICalParser from "ical-js-parser";
import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

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
          due: iCalDateParser(due),
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
          due: iCalDateParser(due),
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
