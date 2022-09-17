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
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data: any | null = await prisma.item.create({
    data: {
      name:
        CryptoJS.AES.encrypt(
          req.query.name,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() ?? "",
      quantity:
        CryptoJS.AES.encrypt(
          req.query.quantity,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() ?? "",
      lastModified: new Date(req.query.lastUpdated) ?? "2022-03-05 12:23:31",
      starred: false,
      room: req.query.room ?? "kitchen",
      note:
        CryptoJS.AES.encrypt(
          "",
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() ?? "",
      category:
        CryptoJS.AES.encrypt(
          req.query.category,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() ?? "[]",
      property: {
        connect: { id: req.query.property },
      },
    },
    include: {
      property: true,
    },
  });

  res.json(data);
};
export default handler;
