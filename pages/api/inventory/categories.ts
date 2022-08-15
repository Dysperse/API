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
      query:
        "SELECT category FROM Inventory WHERE user = ? AND trash = 0 ORDER BY lastUpdated DESC LIMIT 500",
      values: [req.query.propertyToken ?? "false"],
    });
    const categories = result.map((item: any) => {
      let decryptedCategory = CryptoJS.AES.decrypt(
        item.category,
        process.env.INVENTORY_ENCRYPTION_KEY
      ).toString(CryptoJS.enc.Utf8);

      decryptedCategory = JSON.parse(decryptedCategory);

      return decryptedCategory;
    });
    res.json({
      data: categories.flat(),
    });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
    throw new Error(JSON.stringify(error));
  }
};
export default handler;
