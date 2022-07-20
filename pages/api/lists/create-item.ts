import excuteQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

export default async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await excuteQuery({
      query:
        "INSERT INTO ListItems (parent, user, title, description) VALUES (?, ?, ?, ?)",
      values: [
        req.query.parent ?? -1,
        userId[0].user ?? false,
        req.query.title ?? "",
        req.query.description ?? "",
      ],
    });
    res.json({
      id: result.insertId,
      title: req.query.title,
      description: req.query.description,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
