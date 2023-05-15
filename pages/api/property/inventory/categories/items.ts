import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import type { Item } from "@prisma/client";
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.item.findMany({
    where: {
      room: req.query.room,
      trash: false,
      property: {
        id: req.query.property,
      },
    },
  });
  res.json(
    data.map((item: Item) => {
      const original = CryptoJS.AES.decrypt(
        item.category,
        process.env.INVENTORY_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);

      const parsed = JSON.parse(original);
      if (parsed.includes(req.query.category))
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
          category: original,
        };
    })
  );
};

export default handler;
