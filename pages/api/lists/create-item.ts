import executeQuery from "../../../lib/db";
import { validatePerms } from "../../../lib/check-permissions";
import type { NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const handler = async (req: any, res: NextApiResponse<any>) => {
  const perms = await validatePerms(
    req.query.propertyToken,
    req.query.accessToken
  );
  if (!perms || perms === "read-only") {
    res.json({
      error: "INSUFFICIENT_PERMISSIONS",
    });
    return;
  }

  try {
    const result = await executeQuery({
      query:
        "INSERT INTO ListItems (parent, user, title, description, pinned) VALUES (?, ?, ?, ?, ?)",
      values: [
        req.query.parent ?? -1,
        req.query.propertyToken ?? false,
        CryptoJS.AES.encrypt(
          req.query.title,
          process.env.LIST_ENCRYPTION_KEY
        ).toString() ?? "",
        CryptoJS.AES.encrypt(
          req.query.description,
          process.env.LIST_ENCRYPTION_KEY
        ).toString() ?? "",
        req.query.pinned ?? "",
      ],
    });
    res.json({
      data: {
        id: result.insertId,
        title: req.query.title,
        description: req.query.description,
        pinned: req.query.pinned,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
