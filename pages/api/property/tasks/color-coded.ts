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
              color: "grey",
            },
          },
          {
            property: {
              id: req.query.property,
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
      include: {
        subTasks: true,
        parentTasks: true,
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;