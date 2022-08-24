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
      query: "EDIT ListNames SET description = ? WHERE id = ? AND user = ?",
      values: [
        req.query.description ?? "",
        req.query.id ?? "false",
        req.query.propertyToken ?? false,
      ],
    });
    res.json({
      success: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
