import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import ical from "ical-generator";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["id"]);

    const data = await prisma.task.findMany({
      where: {
        AND: [{ propertyId: req.query.id || "-1" }, { due: { not: null } }],
      },
      include: {
        column: { select: { name: true } },
      },
    });

    const calendar = ical({
      name: "Dysperse",
      description: "Tasks from your Dysperse account at my.dysperse.com",
      url: "https://my.dysperse.com",
      timezone: req.query.timeZone,
    });

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      calendar.createEvent({
        start: item.due || new Date(),
        summary: item.name,
        description: item.description,
        location: item.where,
        priority: 9,
        repeating: item.recurrenceRule,
        allDay: true,
        id: "dysperse-task-" + item.id,
        ...(item?.column?.name && {
          categories: [{ name: item?.column?.name }],
        }),
      });
    }

    // res.send(calendar.toString());
    calendar.serve(res);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
