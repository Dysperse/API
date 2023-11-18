import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";
import { RRule } from "rrule";
dayjs.extend(utc);
dayjs.extend(isBetween);

interface PerspectiveUnit {
  start: string | Dayjs;
  end: string | Dayjs;
  tasks: any[];
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);

    const type = await getApiParam(req, "type", true);
    const _start = await getApiParam(req, "start", true);
    const _end = await getApiParam(req, "end", true);

    const map = {
      week: "day",
      month: "week",
      year: "month",
    };

    if (!map[type]) return Response.json({ error: "Invalid `type`" });

    const start = dayjs(_start).utc();
    const end = dayjs(_end).utc();

    // Create an array of dates as Dayjs objects for each perspective unit
    const units: PerspectiveUnit[] = Array.from(
      { length: end.diff(start, map[type]) + 1 },
      (_, i) => ({
        start: start.add(i, map[type]).toISOString(),
        end: start.add(i, map[type]).endOf(map[type]).toISOString(),
        tasks: [],
      })
    );

    // Retrieve tasks in a single query
    const tasks = await prisma.task.findMany({
      where: {
        parentTasks: { none: { property: { id: spaceId } } },
        property: { id: spaceId },
        OR: [
          {
            recurrenceRule: null,
            due: { gte: start.toDate(), lte: end.toDate() },
          },
          { recurrenceRule: { not: null } },
        ],
      },
      orderBy: [{ pinned: "desc" }, { name: "asc" }],
      include: {
        parentTasks: true,
        subTasks: { include: { completionInstances: { take: 1 } } },
        completionInstances: true,
        column: {
          include: {
            board: { select: { id: true, name: true, public: true } },
          },
        },
        createdBy: {
          select: {
            name: true,
            color: true,
            email: true,
            Profile: {
              select: { picture: true },
            },
          },
        },
      },
    });

    const recurringTasks = tasks.filter((task) => task.recurrenceRule);

    // Use a Map to store tasks for each perspective unit
    const tasksByUnit: any = new Map(units.map((unit) => [unit, []]));

    // Populate the tasks for each perspective unit
    for (const task of recurringTasks) {
      if (!task.recurrenceRule) continue;
      const rule = RRule.fromString(
        `DTSTART:${start.format("YYYYMMDDTHHmmss[Z]")}\n` +
          (task.recurrenceRule.includes("\n")
            ? task.recurrenceRule.split("\n")[1]
            : task.recurrenceRule
          ).replace(/^EXDATE.*$/, "")
      ).between(start.toDate(), end.toDate(), true);

      for (const dueDate of rule) {
        const due = dayjs(dueDate).utc();
        const unit = units.find(({ start, end }) =>
          due.isBetween(start, end, map[type], "[]")
        );
        if (unit)
          tasksByUnit.get(unit).push({ ...task, recurrenceDay: dueDate });
      }
    }

    for (const task of tasks.filter((task) => task.recurrenceRule === null)) {
      const due = dayjs(task.due).utc();
      const unit = units.find(({ start, end }) =>
        due.isBetween(start, end, map[type], "[]")
      );
      if (unit) tasksByUnit.get(unit).push(task);
    }
    // Convert the map of tasks by unit to an array of PerspectiveUnit objects
    const returned = units.map((unit) => ({
      start: unit.start,
      end: unit.end,
      tasks: tasksByUnit.get(unit),
    }));

    return Response.json(returned);
  } catch (e) {
    return handleApiError(e);
  }
}
