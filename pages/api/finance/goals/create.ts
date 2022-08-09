import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";
import type { NextApiResponse } from "next";

const handler = async (req: any, res: NextApiResponse<any>) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query:
        "INSERT INTO FinanceGoals (name, image, note, completed, minAmountOfMoney, user, accountId) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values: [
        req.query.name ?? "false",
        req.query.image ?? "false",
        req.query.note ?? "",
        "false",
        req.query.minAmountOfMoney ?? "100",
        userId ?? "false",
        req.query.accountId ?? "false",
      ],
    });
    res.json({
      data: {
        id: result.insertId,
        name: req.query.name,
        image: req.query.image,
        note: req.query.note,
        completed: false,
        minAmountOfMoney: req.query.minAmountOfMoney,
        user: userId,
        accountId: req.query.accountId,
      },
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
