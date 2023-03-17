import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.task.findMany({
    where: {
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
    },
    include: {
      subTasks: true,
      parentTasks: true,
    },
  });
  res.json(data);
};

export default handler;
