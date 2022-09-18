import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
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

  const data: any | null = await prisma.item.findMany({
    where: {
      room: req.query.room,
      property: {
        id: req.query.property,
      },
    },
    select: {
      id: true,
    },
  });
  res.json(data.length);
};

export default handler;
