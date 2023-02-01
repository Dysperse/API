import CryptoJS from "crypto-js";
import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
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
