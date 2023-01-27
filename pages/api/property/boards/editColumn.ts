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

  const data = await prisma.column.update({
    where: {
      id: parseInt(req.query.columnId),
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
