import excuteQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

export default async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await excuteQuery({
      query: "SELECT * FROM SyncTokens WHERE email = :email",
      values: [req.query.result ?? "false"],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
