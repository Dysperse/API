import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { Prisma } from "@prisma/client";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const wherePermissionsMatch: any = [
      // Make sure that the task is in the property
      { property: { id: req.query.property } },

      // Or, if the column is null but within the property
      {
        OR: [
          { column: null },
          {
            column: {
              board: {
                AND: [{ public: false }, { userId: req.query.userIdentifer }],
              },
            },
          },
          {
            column: {
              board: {
                AND: [{ public: true }, { propertyId: req.query.property }],
              },
            },
          },
        ],
      },
    ];

    const where: Prisma.TaskWhereInput = {
      AND: [
        { recurrenceRule: null },
        // Prevent selecting subtasks
        { parentTasks: { none: { property: { id: req.query.property } } } },
        // Make sure that the tasks falls within these dates
        { due: { gte: new Date(req.query.startTime) } },
        { due: { lte: new Date(req.query.endTime) } },

        ...wherePermissionsMatch,
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
            subTasks: true,
            parentTasks: true,
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
        AND: [...wherePermissionsMatch, { recurrenceRule: { not: null } }],
      },
    });

    res.json({ data, recurringTasks });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
