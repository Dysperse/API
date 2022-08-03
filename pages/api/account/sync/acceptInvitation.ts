import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query:
        "UPDATE SyncTokens SET accepted = 'true' WHERE accessToken = ? AND email = ?",
      values: [req.query.accessToken, req.query.email],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
