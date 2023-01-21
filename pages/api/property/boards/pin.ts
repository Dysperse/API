import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";
/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
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
