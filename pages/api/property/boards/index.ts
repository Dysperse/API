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
      columns: true,
    },
    orderBy: {
      pinned: "desc",
    },
  });
  res.json(data);
};

export default handler;
