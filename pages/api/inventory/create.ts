import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query:
        "INSERT INTO Inventory (name, qty, category, user, star, lastUpdated, room, trash) VALUES (?, ?, ?, ?, 0, ?, ?, 0)",
      values: [
        req.query.name ?? "",
        req.query.qty ?? "",
        req.query.category ?? "[]",
        userId[0].user ?? false,
        req.query.lastUpdated ?? "2022-03-05 12:23:31",
        req.query.room ?? "kitchen",
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
