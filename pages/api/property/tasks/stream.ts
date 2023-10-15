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
          // Prevent selecting subtasks
          { parentTasks: { none: { property: { id: req.query.property } } } },
          // Make sure that the task is in the property
          { property: { id: req.query.property } },

          // Backlog
          ...(req.query.view === "backlog"
            ? [{ due: { lte: new Date(req.query.time) }, completed: false }]
            : []),

          // Upcoming
          ...(req.query.view === "upcoming"
            ? [{ due: { gte: new Date(req.query.time) }, completed: false }]
            : []),

          // Unscheduled
          ...(req.query.view === "unscheduled" ? [{ due: null }] : []),

          {
            OR: [
              { column: null },
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
      orderBy: {
        completed: "asc",
      },
      include: {
        completionInstances: true,
        subTasks: { include: { completionInstances: true } },
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

    if (req.query.view === "completed") {
      return res.json(data.filter((e) => e.completionInstances.length > 0));
    }
    res.json(
      data.filter(
        (e) => e.recurrenceRule === null && e.completionInstances.length === 0
      )
    );
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
