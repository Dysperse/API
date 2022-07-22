import excuteQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await excuteQuery({
      query:
        "UPDATE Inventory SET note = ?, lastUpdated = ? WHERE id = ? AND user = ?",
      values: [
        req.query.note ?? "",
        req.query.lastUpdated ?? "2022-03-05 12:23:31",
        req.query.id ?? "false",
        userId[0].user ?? false,
      ],
    });
    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
