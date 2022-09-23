import { prisma } from "../../../lib/client";
import { validatePermissions } from "../../../lib/validatePermissions";

/**
 * API handler for the /api/property/updateInfo endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req: any, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  //   Update name, type, and bannerColor
  const data: any | null = await prisma.property.update({
    where: {
      id: req.query.property,
    },
    data: {
      name: req.query.name || undefined,
      type: req.query.type || undefined,
      color: req.query.color || undefined,
    },
  });

  res.json(data);
};
export default handler;
