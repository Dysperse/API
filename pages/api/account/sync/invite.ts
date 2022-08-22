import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";
import { v4 as uuidv4 } from "uuid";

const handler = async (req: any, res: any) => {
  try {
    const users = await executeQuery({
      query: "SELECT * FROM Accounts WHERE email = ?",
      values: [req.query.email ?? "false"],
    });
    if (!users[0]) {
      res.json({
        data: false,
      });
    }
    const result = await executeQuery({
      query:
        "INSERT INTO `SyncTokens`(`propertyToken`, `accessToken`, `email`, `name`, `houseName`, `houseType`, `accepted`, `role`) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      values: [
        req.query.propertyToken ?? "",
        uuidv4(),
        req.query.email ?? "",
        users[0] ? users[0].name : "Unknown user",
        req.query.houseName ?? "Untitled property",
        req.query.houseType ?? "",
        "false",
        req.query.role ?? "member",
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
