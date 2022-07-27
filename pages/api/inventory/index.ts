import excuteQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await excuteQuery({
      query: req.query.limit
        ? "SELECT * FROM Inventory WHERE user = ? AND trash = 0 ORDER BY lastUpdated DESC LIMIT ?"
        : "SELECT * FROM Inventory WHERE user = ? AND trash = 0 AND room = ? ORDER BY lastUpdated DESC",
      values: req.query.limit
        ? [userId[0].user ?? false, parseInt(req.query.limit)]
        : [userId[0].user ?? false, req.query.room ?? "kitchen"],
    });
    res.json({
      data: result.map((item: any) => {
        return {
          id: item.id,
          lastUpdated: item.lastUpdated,
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
    res.status(500).json({ error: error });
  }
};
export default handler;
