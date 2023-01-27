import type { Item } from "@prisma/client";
import CryptoJS from "crypto-js";
import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

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
      room: req.query.room,
      property: {
        id: req.query.property,
      },
    },
  });
  // Set type to CSV
  res.setHeader("Content-Type", "text/plain");

  res.send(
    data
      .map((item: Item) => {
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
      .join("\n")
  );
};

export default handler;
