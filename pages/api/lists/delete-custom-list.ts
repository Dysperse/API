import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    await executeQuery({
      query: "DELETE FROM ListNames WHERE id = ? AND login = ?",
      values: [req.query.id ?? "false", userId[0].user ?? false],
    });
    await executeQuery({
      query: "DELETE FROM ListItems WHERE parent = ? AND login = ?",
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
