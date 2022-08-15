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
        "SELECT * FROM ListItems WHERE parent = ? AND user = ? ORDER BY ID ASC",
      values: [req.query.parent, req.query.propertyToken ?? false],
    });
    res.json({
      data: result.map((item) => {
        return {
          ...item,
          title: CryptoJS.AES.decrypt(
            item.title,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          description: CryptoJS.AES.decrypt(
            item.description,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
