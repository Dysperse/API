import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { Prisma } from "@prisma/client";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const where: Prisma.TaskWhereInput = {
      AND: [
        { recurrenceRule: null },
        // Prevent selecting subtasks
        { parentTasks: { none: { property: { id: req.query.property } } } },
        // Make sure that the tasks falls within these dates
        { due: { gte: new Date(req.query.startTime) } },
        { due: { lte: new Date(req.query.endTime) } },

        { property: { id: req.query.property } },
      ],
    };

    // Used for dots on DatePicker component
    if (req.query.count) {
      const data = await prisma.task.groupBy({
        by: ["due"],
        _count: {
          name: true,
          _all: true,
        },
        orderBy: {
          due: "asc",
        },
        where,
      });

      res.json(data);
      return;
    }

    // Used for `/perspectives/:id` page
    const data = await prisma.task.findMany({
      where,
      include: req.query.count
        ? undefined
        : {
            subTasks: { include: { completionInstances: true } },
            parentTasks: true,
            completionInstances: { take: 1 },
            column: {
              select: {
                board: {
                  select: {
                    name: true,
                    id: true,
                  },
                },
                name: true,
                emoji: true,
              },
            },
          },
    });

    const recurringTasks = await prisma.task.findMany({
      where: {
        AND: [
          { property: { id: req.query.property } },
          { recurrenceRule: { not: null } },
          { parentTasks: { none: { property: { id: req.query.property } } } },
        ],
      },
      include: {
        subTasks: true,
        parentTasks: true,
        completionInstances: {
          where: { iteration: { gte: new Date(req.query.startTime) } },
        },
      },
    });

    res.json({ data, recurringTasks });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
