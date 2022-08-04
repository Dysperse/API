import executeQuery from "../../../lib/db";
import { validatePerms } from "../../../lib/check-permissions";
import type { NextApiResponse } from "next";

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
    await executeQuery({
      query: "DELETE FROM ListNames WHERE id = ? AND user = ?",
      values: [req.query.id ?? "false", req.query.propertyToken ?? false],
    });
    await executeQuery({
      query: "DELETE FROM ListItems WHERE parent = ? AND user = ?",
      values: [req.query.id ?? "false", req.query.propertyToken ?? false],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
