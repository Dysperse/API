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
      query: "SELECT * FROM ListNames WHERE user = ? ORDER BY ID ASC",
      values: [req.query.propertyToken ?? false],
    });
    res.json({
      data: result.map((item) => {
        return {
          id: item.id,
          title: CryptoJS.AES.decrypt(
            item.title,
            process.env.LIST_ENCRYPTION_KEY
          ).toString(CryptoJS.enc.Utf8),
          description: item.description,
          star: item.star,
          count: 100,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
