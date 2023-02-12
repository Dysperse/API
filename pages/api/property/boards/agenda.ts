import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  console.log(new Date(req.query.startTime));
  console.log(new Date(req.query.endTime));

  /**
   * 🚨🚨🚨🚨🚨🚨🚨 DO NOT REMOVE THIS COMMENT 🚨🚨🚨🚨🚨🚨🚨🚨
   * this is probably the most complicated postgres query in my app 😭
   * essentially it finds:
    OR:
    AND: [ tasks within a time range, column not specified ]
    AND: 
        OR: [
            board is private, user id is equal to req.query.userIdentifier, 
            board is public and group token is valid
            ],
        [ task is within time range ]
   */

  console.time("How long does this insanely idiotic function take?");
  const data = await prisma.task.findMany({
    where: {
      AND: [
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
  console.timeEnd("How long does this insanely idiotic function take?");
  res.json(data);
};

export default handler;
