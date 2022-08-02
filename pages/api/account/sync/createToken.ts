import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

const handler = async (req: any, res: any) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const users = await executeQuery({
      query: "SELECT * FROM Accounts WHERE email = ?",
      values: [req.query.email ?? "false"],
    });

    const result = await executeQuery({
      query:
        "INSERT INTO SyncTokens (token, email, login, houseName, accepted, name, houseType) VALUES (?, ?, ?, ?, 'false', ?, ?)",
      values: [
        req.query.token ?? "false",
        req.query.email ?? "false",
        userId[0].user ?? false,
        req.query.houseName ?? "false",
        users[0].name ?? "Unknown user",
        req.query.houseType ?? "home",
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
