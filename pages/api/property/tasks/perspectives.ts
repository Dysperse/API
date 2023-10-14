import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import dayjs, { Dayjs } from "dayjs";
import { RRule } from "rrule";

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

    // Get the column start and end
    const map = {
      week: "day",
      month: "week",
      year: "month",
    };

    // Get type of perspective view
    const { timezone, type } = req.query;
    if (!map[type]) return res.json({ error: "Invalid `type`" });

    // Used to get events only from the perspective start to end
    const start = dayjs(req.query.start);
    const end = dayjs(req.query.end);

    // Get # of ____ (i.e. days) in ____ (i.e. week)
    const units: PerspectiveUnit[] = [
      ...new Array(end.diff(start, map[type]) + 1),
    ].map((_, i) => {
      return {
        start: dayjs(start)
          .utc()
          .add(i, map[type])
          .startOf(map[type])
          .toISOString(),
        end: dayjs(start)
          .utc()
          .add(i, map[type])
          .endOf(map[type])
          .toISOString(),

        tasks: [],
      };
    });

    let returned = units;

    const tasks = await prisma.task.findMany({
      where: {
        AND: [
          // Don't select subtasks
          { parentTasks: { none: { property: { id: req.query.property } } } },

          // Make sure the user owns these tasks
          { property: { id: req.query.property } },

          // remember, recurring tasks have weird times...
          {
            OR: [
              // If it doesn't have a recurrence
              {
                AND: [
                  { recurrenceRule: null },
                  // { due: { not: null } },
                  { due: { gte: start.toDate() } },
                  { due: { lte: end.toDate() } },
                ],
              },
              // If it has a recurrence. We'll have to filter these out later...
              {
                AND: [{ recurrenceRule: { not: null } }],
              },
            ],
          },
        ],
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

    // Get the specific day this recurrs
    let recurringTasks = tasks
      .filter((task) => task.recurrenceRule)
      .map((task) => {
        const rule = RRule.fromString(
          `DTSTART:${start.format("YYYYMMDDTHHmmss[Z]")}\n` +
            ((task.recurrenceRule as any).includes("\n")
              ? task.recurrenceRule?.split("\n")[1]
              : task.recurrenceRule)
        ).between(start.toDate(), end.toDate(), true);
        return rule.length > 0 ? { ...task, recurrenceDay: rule } : undefined;
      });

    let regularTasks = tasks.filter((task) => task.recurrenceRule === null);

    // Add all recurring tasks!
    for (const i in recurringTasks) {
      const task = recurringTasks[i];
      for (const dueIndex in task?.recurrenceDay) {
        const due = dayjs(task.recurrenceDay[dueIndex]);

        const index = returned.findIndex(({ start, end }) =>
          due.isBetween(start, end, map[type], "[]")
        );

        if (returned[index]) {
          returned[index].tasks.push(task);
        } else {
          console.log("Missing recurring value: " + due.toISOString());
        }
      }
    }

    // Add other tasks
    for (const i in regularTasks) {
      const task = regularTasks[i];
      const due = dayjs(task.due);

      const index = returned.findIndex(({ start, end }) =>
        due.isBetween(start, end, map[type], "[]")
      );

      if (returned[index]) {
        returned[index].tasks.push(task);
      } else {
        console.log({
          type: "absolute",
          name: task.name,
          start: start.toDate(),
          end: end.toDate(),
          due: due.toDate(),
        });
      }
    }
    res.json(returned);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
};

export default handler;
