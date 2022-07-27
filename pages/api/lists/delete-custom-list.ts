import excuteQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    await excuteQuery({
      query: "DELETE FROM ListNames WHERE id = ? AND user = ?",
      values: [req.query.id ?? "false", userId[0].user ?? false],
    });
    await excuteQuery({
      query: "DELETE FROM ListItems WHERE parent = ? AND user = ?",
      values: [req.query.id ?? "false", userId[0].user ?? false],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
