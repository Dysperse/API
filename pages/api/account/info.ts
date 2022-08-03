import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

export const getInfo = async (token: any) => {
  const userId = await ExchangeToken(token);
  const result = await executeQuery({
    query: "SELECT * FROM Accounts WHERE id = ?",
    values: [userId[0].user ?? false],
  });
  if (!result[0]) {
    return {
      data: false,
    };
  }
  const property = await executeQuery({
    query: "SELECT * FROM SyncTokens WHERE accessToken = ?",
    values: [result[0].SyncToken],
  });

  return {
    account: result.map((data) => {
      return {
        ...data,
        id: undefined,
        password: undefined,
        SyncToken: undefined,
        FinanceToken: undefined,
        "2faCode": undefined,
        onboarding: parseInt(data.onboarding),
        notificationMin: parseInt(data.notificationMin),
        verifiedEmail: parseInt(data.verifiedEmail),
        darkMode: JSON.parse(data.darkMode),
        accessToken: token,
        financeToken: data.FinanceToken,
      };
    })[0],
    property: property.map((data) => {
      return {
        ...data,
        id: undefined,
        accepted: JSON.parse(data.accepted),
      };
    })[0],
  };
};

const handler = async (req, res) => {
  const data = await getInfo(req.query.token);
  if (data.data === false) {
    res.status(500).send('{ "error": true }');
    return;
  }
  res.json(data);
};

export default handler;
