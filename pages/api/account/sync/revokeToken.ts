import executeQuery from "../../../../lib/db";
import type { NextApiResponse } from "next";
import { validatePerms } from "../../../../lib/check-permissions";

const handler = async (req: any, res: NextApiResponse<any>) => {
  try {
    const perms = await validatePerms(
      req.query.propertyToken,
      req.query.accessToken
    );

    if (!perms || perms !== "owner") {
      res.json({
        error: "INSUFFICIENT_PERMISSIONS",
      });
      return;
    }
    const result = await executeQuery({
      query:
        "DELETE FROM SyncTokens WHERE email = ? AND propertyToken = ? AND id = ?",
      values: [
        req.query.email ?? "false",
        req.query.propertyToken ?? "false",
        req.query.id ?? "false",
      ],
    });
    const query = await executeQuery({
      query: "SELECT * FROM SyncTokens WHERE email = ?",
      values: [req.query.email ?? "false"],
    });
    await executeQuery({
      query: "UPDATE Accounts SET SyncToken = ? WHERE email = ?",
      values: [query[0].propertyToken, req.query.email ?? "false"],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
