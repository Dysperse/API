import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  //  List all boards with columns, but not items
  const data = await prisma.board.findMany({
    where: {
      OR: [
        {
          public: true,
          AND: {
            property: {
              id: req.query.property,
            },
          },
        },
        {
          AND: [
            { public: false },
            {
              userId: req.query.userIdentifier,
            },
          ],
        },
      ],
    },
    include: {
      columns: {
        orderBy: {
          id: "desc",
        },
      },
      integrations: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      pinned: "desc",
    },
  });
  res.json(data);
};

export default handler;
