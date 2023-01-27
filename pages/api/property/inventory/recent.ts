import CryptoJS from "crypto-js";
import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.item.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
    orderBy: {
      lastModified: "desc",
    },
    take: 50,
  });
  res.json(
    data.map((item) => {
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
