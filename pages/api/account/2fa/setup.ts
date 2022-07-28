import executeQuery from "../../../../lib/db";
import { ExchangeToken } from "../../../../lib/exchange-token";
import notp from "notp";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    //.... some initial login code, that receives the user details and TOTP / HOTP token

    var key = req.query.key;
    var token = req.query.code;

    // Check TOTP is correct (HOTP if hotp pass type)
    var login = notp.totp.verify(token, key);

    // invalid token if login is null
    if (!login) {
      res.json({
        data: false,
      });
      return false;
    }

    await executeQuery({
      query: "UPDATE Accounts SET 2faCode = ? WHERE id = ?",
      values: [req.query.key, userId[0].user ?? false],
    });

    res.json({
      data: true,
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
