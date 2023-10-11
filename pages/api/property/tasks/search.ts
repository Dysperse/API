import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.task.findMany({
      include: {
        completionInstances: true,
      },
      where: {
        AND: [
          // Make sure that the task is in the property
          { property: { id: req.query.property } },
          {
            name: {
              contains: req.query.query.toLowerCase(),
              mode: "insensitive",
            },
          },
          // If it's private, match up the task's user id with the provided identifier.
          // If it's public, just *select it* bruh
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
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
