import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import dayjs, { Dayjs } from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { RRule } from "rrule";
dayjs.extend(utc);
dayjs.extend(isBetween);

interface PerspectiveUnit {
  start: string | Dayjs;
  end: string | Dayjs;
  tasks: any[];
}

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const map = {
      week: "day",
      month: "week",
      year: "month",
    };

    const { type } = req.query; // Removed unnecessary 'timezone' variable
    if (!map[type]) return res.json({ error: "Invalid `type`" });

    const start = dayjs(req.query.start);
    const end = dayjs(req.query.end);

    // Create an array of dates as Dayjs objects for each perspective unit
    const units: PerspectiveUnit[] = Array.from(
      { length: end.diff(start, map[type]) + 1 },
      (_, i) => ({
        start: dayjs(start).add(i, map[type]).startOf(map[type]).toISOString(),
        end: dayjs(start).add(i, map[type]).endOf(map[type]).toISOString(),
        tasks: [],
      })
    );

    // Retrieve tasks in a single query
    const tasks = await prisma.task.findMany({
      where: {
        parentTasks: { none: { property: { id: req.query.property } } },
        property: { id: req.query.property },
        due: { gte: start.toDate(), lte: end.toDate() },
        OR: [{ recurrenceRule: null }, { recurrenceRule: { not: null } }],
      },
      orderBy: { pinned: "desc" },
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
            : task.recurrenceRule)
      ).between(start.toDate(), end.toDate(), true);

      for (const dueDate of rule) {
        const due = dayjs(dueDate);
        const unit = units.find(({ start, end }) =>
          due.isBetween(start, end, map[type], "[]")
        );
        if (unit)
          tasksByUnit.get(unit).push({ ...task, recurrenceDay: dueDate });
      }
    }

    for (const task of tasks.filter((task) => task.recurrenceRule === null)) {
      const due = dayjs(task.due);
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

    res.json(returned);
  } catch (e: any) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
};

export default handler;
