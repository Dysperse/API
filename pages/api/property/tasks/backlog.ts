import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.task.findMany({
      where: {
        AND: [
          { completed: false },
          {
            NOT: {
              due: null,
            },
          },
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
              [req.query.upcoming ? "gte" : "lte"]: new Date(req.query.date),
            },
          },
          // If it's private, match up the task's user id with the provided identifier.
          // If it's public, just *select it* bruh
          {
            OR: [
              {
                column: null,
              },
              {
                column: {
                  board: {
                    AND: [
                      { public: false },
                      { userId: req.query.userIdentifer },
                    ],
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
      },
      ...(!req.query.count && {
        include: {
          subTasks: true,
          parentTasks: true,
        },
      }),
      orderBy: {
        due: req.query.upcoming ? "asc" : "desc",
      },
      ...(req.query.count && {
        select: {
          id: true,
        },
      }),
    });
    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};

export default handler;
