import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.item.create({
      data: {
        name:
          CryptoJS.AES.encrypt(
            req.query.name,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString() || "",
        quantity:
          CryptoJS.AES.encrypt(
            req.query.quantity,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString() ?? "",
        lastModified: new Date(req.query.lastModified) || new Date(),
        starred: false,
        trash: false,
        room: req.query.room ?? "kitchen",
        note:
          CryptoJS.AES.encrypt(
            "",
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString() ?? "",
        category:
          CryptoJS.AES.encrypt(
            req.query.category,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString() ?? "[]",
        property: {
          connect: { id: req.query.property },
        },
      },
      include: {
        property: true,
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
