import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import type { Item } from "@prisma/client";
import CryptoJS from "crypto-js";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    let room: any = null;
    if (req.query.custom) {
      room = await prisma.customRoom.findFirst({
        where: {
          OR: [
            {
              AND: [
                { id: req.query.room },
                { private: false },
                { propertyId: req.query.property },
              ],
            },
            {
              AND: [
                { id: req.query.room },
                { private: true },
                { userIdentifier: req.query.userIdentifier },
              ],
            },
          ],
        },
      });
      if (!room) {
        res.json({
          error: "missing-permissions-or-not-found",
        });
        return;
      }
    } else {
      room = { name: req.query.room };
    }

    const data = await prisma.item.findMany({
      where: {
        room: req.query.room,
        trash: false,
        property: { id: req.query.property },
      },
    });

    res.json({
      room,
      items: data.map((item: Item) => {
        return {
          ...item,
          name: CryptoJS.AES.decrypt(
            item.name,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString(CryptoJS.enc.Utf8),
          quantity: CryptoJS.AES.decrypt(
            item.quantity,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString(CryptoJS.enc.Utf8),
          note: CryptoJS.AES.decrypt(
            item.note,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString(CryptoJS.enc.Utf8),
          category: CryptoJS.AES.decrypt(
            item.category,
            process.env.INVENTORY_ENCRYPTION_KEY,
          ).toString(CryptoJS.enc.Utf8),
        };
      }),
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
