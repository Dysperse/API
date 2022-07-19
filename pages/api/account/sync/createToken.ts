import excuteQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

export default async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await excuteQuery({
      query:
        "INSERT INTO SyncTokens (token, email, login, houseName) VALUES (?, ?, ?, ?)",
      values: [
        req.query.token ?? "false",
        req.query.email ?? "false",
        userId[0].user ?? false,
        req.query.houseName ?? "false",
      ],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
