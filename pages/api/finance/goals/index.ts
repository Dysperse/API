import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";
import type { NextApiResponse } from "next";

const handler = async (req: any, res: NextApiResponse<any>) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query: "SELECT * FROM FinanceGoals WHERE user = ? AND accountId = ?",
      values: [userId ?? "false", req.query.accountId ?? "false"],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
