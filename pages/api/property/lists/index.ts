import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";

const handler = async (req: any, res: any) => {
  const data: any | null = await prisma.list.findMany({
    where: {
      propertyId: req.query.propertyId,
      Property: {
        id: req.query.propertyId,
        accessToken: req.query.accessToken,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      items: true,
    },
  });
  const e = data.map((list: any) => {
    // console.log(list.name);
    return {
      ...list,
      name: CryptoJS.AES.decrypt(
        list.name,
        process.env.LIST_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8),
      description: CryptoJS.AES.decrypt(
        list.description,
        process.env.LIST_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8),
    };
  });
  console.log(e);
  res.json(e);
};
export default handler;
