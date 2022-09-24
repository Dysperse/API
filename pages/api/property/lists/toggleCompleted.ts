import { prisma } from "../../../../lib/client";
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
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.listItem.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      completed: req.query.completed === "true" ? false : true,
    },
  });
  res.json(data);
};

export default handler;
