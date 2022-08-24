import executeQuery from "../../../lib/db";
import { validatePerms } from "../../../lib/check-permissions";
import type { NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const handler = async (req: any, res: NextApiResponse<any>) => {
  const perms = await validatePerms(
    req.query.propertyToken,
    req.query.accessToken
  );
  if (!perms) {
    res.json({
      error: "INSUFFICIENT_PERMISSIONS",
    });
    return;
  }

  try {
    const lists = await executeQuery({
      query: "SELECT * FROM ListNames WHERE user = ?;",
      values: [req.query.propertyToken],
    });
    const items = await executeQuery({
      query: "SELECT * FROM ListItems WHERE user = ? ORDER BY ID ASC",
      values: [req.query.propertyToken ?? false],
    });

    res.json({
      lists: [
        ...lists.map((list) => {
          return {
            ...list,
            parent: parseInt(list.parent),
            title: CryptoJS.AES.decrypt(
              list.title,
              process.env.LIST_ENCRYPTION_KEY
            ).toString(CryptoJS.enc.Utf8),
          };
        }),
        { id: "-1", title: "To-do", description: "", star: "0" },
        { id: "-2", title: "Shopping list", description: "", star: "0" },
      ],
      items: items.map((item: any) => {
        return {
          ...item,
          parent: parseInt(item.parent),
          pinned: item.pinned ? item.pinned === "true" : false,
          title: CryptoJS.AES.decrypt(
            item.title,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          description: CryptoJS.AES.decrypt(
            item.description,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          user: undefined,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
