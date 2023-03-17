import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  await prisma.board.updateMany({
    data: {
      pinned: false,
    },
    where: {
      propertyId: req.query.property,
    },
  });

  const data = await prisma.board.update({
    data: {
      pinned: req.query.pinned == "true",
    },
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
};

export default handler;
