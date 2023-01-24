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

  console.log(req.query.completed);
  const data = await prisma.task.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      pinned: req.query.pinned == "true",
    },
  });

  res.json(data);
};

export default handler;
