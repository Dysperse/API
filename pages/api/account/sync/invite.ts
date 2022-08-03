import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";

const handler = async (req: any, res: any) => {
  try {
    const users = await executeQuery({
      query: "SELECT * FROM Accounts WHERE email = ?",
      values: [req.query.email ?? "false"],
    });

    const result = await executeQuery({
      query:
        "INSERT INTO `SyncTokens`(`accessToken`, `email`, `name`, `houseName`, `houseType`, `accepted`, `role`) VALUES (?, ?, ?, ?, ?, ?, ?)",
      values: [
        req.query.accessToken ?? "",
        req.query.email ?? "",
        users[0].name,
        req.query.houseName ?? "Untitled property",
        req.query.houseType ?? "",
        "false",
        req.query.role ?? "member",
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
