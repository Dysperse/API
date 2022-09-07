import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.item.findMany({
    where: {
      room: req.query.room,
      property: {
        id: req.query.property,
        accessToken: req.query.accessToken,
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
