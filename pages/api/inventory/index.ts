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
    const result = await executeQuery({
      query: req.query.limit
        ? "SELECT *, DATE_FORMAT(lastUpdated, '%Y-%m-%d %T') AS formattedLastUpdated FROM Inventory WHERE user = ? AND trash = 0 ORDER BY lastUpdated DESC LIMIT ?"
        : "SELECT *, DATE_FORMAT(lastUpdated, '%Y-%m-%d %T') AS formattedLastUpdated FROM Inventory WHERE user = ? AND trash = 0 AND room = ? ORDER BY lastUpdated DESC LIMIT 150",
      values: req.query.limit
        ? [req.query.propertyToken ?? false, parseInt(req.query.limit)]
        : [req.query.propertyToken ?? false, req.query.room ?? "kitchen"],
    });
    res.json({
      data: result.map((item: any) => {
        return {
          id: item.id,
          lastUpdated: item.formattedLastUpdated,
          amount: CryptoJS.AES.decrypt(
            item.qty,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          title: CryptoJS.AES.decrypt(
            item.name,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          categories: [],
          note: CryptoJS.AES.decrypt(
            item.note,
            process.env.INVENTORY_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          star: item.star,
          room: item.room,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
    throw new Error(error);
  }
};
export default handler;
