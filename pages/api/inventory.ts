import excuteQuery from "../../lib/db";
import { ExchangeToken } from "../../lib/exchange-token";

export default async (req, res) => {
  try {
    console.log("req nom", req.body);
    const userId = await ExchangeToken(req.query.token);

    const result = await excuteQuery({
      query: "SELECT * FROM Inventory WHERE user = ? AND room = ?",
      values: [userId[0].user ?? false, req.query.room ?? "kitchen"],
    });
    res.json({
      data: result.map((item) => {
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
