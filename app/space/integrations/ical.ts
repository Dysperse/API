import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import ical from "ical-generator";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = await getApiParam(req, "id", true);
    const timeZone = await getApiParam(req, "timeZone", true);

    const data = await prisma.task.findMany({
      where: {
        AND: [{ propertyId: id }, { due: { not: null } }],
      },
      include: {
        column: { select: { name: true } },
      },
    });

    const calendar = ical({
      name: "Dysperse",
      description: "Tasks from your Dysperse account at my.dysperse.com",
      url: "https://my.dysperse.com",
      timezone: timeZone,
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

    return Response.json(calendar.toString());
  } catch (e) {
    return handleApiError(e);
  }
}
