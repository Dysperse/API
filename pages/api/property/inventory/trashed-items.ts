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
      trash: true,
      property: {
        id: req.query.property,
      },
    },
  });
  res.json(
    data.map((item: any) => {
      return {
        ...item,
        name: CryptoJS.AES.decrypt(
          item.name,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8),
        quantity: CryptoJS.AES.decrypt(
          item.quantity,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8),
        note: CryptoJS.AES.decrypt(
          item.note,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8),
        category: CryptoJS.AES.decrypt(
          item.category,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString(CryptoJS.enc.Utf8),
      };
    })
  );
};

export default handler;
