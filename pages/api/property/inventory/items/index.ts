import CryptoJS from "crypto-js";
import { prisma } from "../../../../../lib/server/prisma";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const item = await prisma.item.findUnique({
    where: {
      id: req.query.id,
    },
  });
  if (!item) {
    res.json(null);
    return;
  }

  res.json({
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
  });
};

export default handler;
