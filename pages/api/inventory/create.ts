import executeQuery from "../../../lib/db";
import { validatePerms } from "../../../lib/check-permissions";
import type { NextApiResponse } from "next";
import CryptoJS from "crypto-js";

const handler = async (req: any, res: NextApiResponse<any>) => {
  try {
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
    await executeQuery({
      query:
        "INSERT INTO Inventory (name, qty, category, user, star, lastUpdated, room, trash) VALUES (?, ?, ?, ?, 0, ?, ?, 0)",
      values: [
        CryptoJS.AES.encrypt(
          req.query.name,
          process.env.ENCRYPTION_KEY
        ).toString() ?? "",
        CryptoJS.AES.encrypt(
          req.query.qty,
          process.env.ENCRYPTION_KEY
        ).toString() ?? "",
        CryptoJS.AES.encrypt(
          req.query.category,
          process.env.ENCRYPTION_KEY
        ).toString() ?? "[]",
        req.query.propertyToken ?? false,
        req.query.lastUpdated ?? "2022-03-05 12:23:31",
        req.query.room ?? "kitchen",
      ],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
