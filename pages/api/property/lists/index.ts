import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
import { validatePermissions } from "../../../../lib/validatePermissions";
import type { Item } from "../../../../types/list";
import type { List } from "../../../../types/list";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions: null | string = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );

  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.list.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
    select: {
      id: true,
      name: true,
      description: true,
      items: true,
    },
  });

  const lists = data.map((list: List) => {
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

      items: list.items.map((item: Item) => {
        return {
          ...item,
          name: CryptoJS.AES.decrypt(
            item.name,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          details: CryptoJS.AES.decrypt(
            item.details,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
        };
      }),
    };
  });
  res.json(lists);
};
export default handler;
