import CryptoJS from "crypto-js";
import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

const handler = async (req, res) => {
await validatePermissions(res, {
  minimum: "member",
  credentials: [req.query.property, req.query.accessToken],
});
  //   Update the note on an item
  const data = await prisma.item.update({
    where: {
      id: req.query.id,
    },
    data: {
      ...(req.query.name && {
        name:
          CryptoJS.AES.encrypt(
            req.query.name,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString() ?? "",
      }),
      ...(req.query.quantity && {
        quantity:
          CryptoJS.AES.encrypt(
            req.query.quantity,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString() ?? "",
      }),
      ...(req.query.note && {
        note:
          CryptoJS.AES.encrypt(
            req.query.note,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString() ?? "",
      }),
      ...(req.query.starred && {
        starred: req.query.starred === "true" ? false : true,
      }),
      lastModified: new Date(req.query.lastModified),
      ...(req.query.category && {
        category:
          CryptoJS.AES.encrypt(
            req.query.category,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString() ?? "",
      }),
    },
  });

  res.json(data);
};

export default handler;
