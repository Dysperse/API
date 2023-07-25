import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import ical from "ical-generator";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["id"]);

    const data = await prisma.task.findMany({
      where: {
        propertyId: req.query.id,
      },
      include: {
        column: { select: { name: true } },
      },
    });

    console.log(data);

    const calendar = ical({ name: "Dysperse" });

    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      calendar.createEvent({
        start: item.due || new Date(),
        summary: item.name,
        description: item.description,
        location: item.where,
        priority: 9,
        allDay: true,
        id: "dysperse-task-" + item.id,
        ...(item?.column?.name && {
          categories: [{ name: item?.column?.name }],
        }),
      });
    }

    // res.send(calendar.toString());
    calendar.serve(res);
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
