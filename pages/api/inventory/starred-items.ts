import executeQuery from "../../../lib/db";
import { validatePerms } from "../../../lib/check-permissions";
import type { NextApiResponse } from "next";

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
        "SELECT *, DATE_FORMAT(lastUpdated, '%Y-%m-%d %T') AS formattedLastUpdated FROM Inventory WHERE user = ? AND star = 1 ORDER BY lastUpdated DESC",
      values: [req.query.propertyToken ?? false],
    });
    res.json({
      data: result.map((item: any) => {
        return {
          id: item.id,
          lastUpdated: item.formattedLastUpdated,
          amount: item.qty,
          title: item.name,
          categories: [],
          note: item.note,
          star: item.star,
          room: item.room,
        };
      }),
    });
  } catch (error) {
    res.status(500).json({ error: JSON.stringify(error) });
  }
};
export default handler;
