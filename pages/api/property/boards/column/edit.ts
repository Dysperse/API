import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.column.update({
    where: {
      id: req.query.id,
    },
    data: {
      ...(req.query.name && { name: req.query.name }),
      ...(req.query.emoji && { emoji: req.query.emoji }),
    },
  });

  res.json({
    data,
    success: true,
  });
};

export default handler;
