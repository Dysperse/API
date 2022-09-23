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
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data: any | null = await prisma.customRoom.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
  });
  res.json(data);
};
export default handler;
