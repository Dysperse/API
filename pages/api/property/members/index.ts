import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data: any | null = await prisma.propertyInvite.findMany({
    where: {
      propertyId: req.query.property,
    },
    select: {
      id: true,
      permission: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  res.json(data);
};
export default handler;
