import CryptoJS from "crypto-js";
import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data = await prisma.item.create({
    data: {
      name:
        CryptoJS.AES.encrypt(
          req.query.name,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() || "",
      quantity:
        CryptoJS.AES.encrypt(
          req.query.quantity,
          process.env.INVENTORY_ENCRYPTION_KEY
        ).toString() ?? "",
      lastModified: new Date(req.query.lastModified) || new Date(),
      starred: false,
      trash: false,
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
  console.log(data);
  res.json(data);
};
export default handler;
