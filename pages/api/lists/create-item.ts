import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query:
        "INSERT INTO ListItems (parent, user, title, description) VALUES (?, ?, ?, ?)",
      values: [
        req.query.parent ?? -1,
        userId[0].user ?? false,
        req.query.title ?? "",
        req.query.description ?? "",
      ],
    });
    console.log(result.insertId);
    res.json({
      data: {
        id: result.insertId,
        title: req.query.title,
        description: req.query.description,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
