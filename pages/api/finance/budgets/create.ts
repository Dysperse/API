import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query:
        "INSERT INTO FinanceBudgets (login, amount, category, type) VALUES (?, ?, ?, ?)",
      values: [
        userId[0].user ?? "false",
        req.query.amount,
        req.query.category,
        req.query.type,
      ],
    });
    res.json({
      data: result,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
