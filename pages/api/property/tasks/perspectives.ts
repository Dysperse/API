import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const where = {
      AND: [
        // Prevent selecting subtasks
        {
          parentTasks: {
            none: {
              property: {
                id: req.query.property,
              },
            },
          },
        },
        // Make sure that the task is in the property
        {
          property: {
            id: req.query.property,
          },
        },
        // Make sure that the tasks falls within these dates
        {
          due: {
            gte: new Date(req.query.startTime),
          },
        },
        {
          due: {
            lte: new Date(req.query.endTime),
          },
        },
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
      ],
    };

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
        // take: 3,
      });

      res.json(data);
      return;
    }

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
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
