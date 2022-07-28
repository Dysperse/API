import executeQuery from "../../../lib/db";
import { ExchangeToken } from "../../../lib/exchange-token";

const handler = async (req, res) => {
  try {
    const userId = await ExchangeToken(req.query.token);

    const result = await executeQuery({
      query: "SELECT * FROM Accounts WHERE id = ?",
      values: [userId[0].user ?? false],
    });
    res.json({
      valid: true,
      accessToken: userId[0].token,
      user: result.map((account) => {
        account.password = undefined;
        account.financeToken = account.FinanceToken;
        account.FinanceToken = undefined;
        account.authorizeToken = undefined;
        account.verifyToken = undefined;
        account.onboarding = parseInt(account.onboarding);
        account.notificationMin = parseInt(account.notificationMin);
        account.studentMode = JSON.parse(account.studentMode);
        account.darkMode = JSON.parse(account.darkMode);
        return account;
      })[0],
    });
  } catch (error) {
    res.status(500).json({ error: error });
  }
};
export default handler;
function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

export const getInfo = async (token: any) => {
  const userId = await ExchangeToken(token);
  const result = await executeQuery({
    query: "SELECT * FROM Accounts WHERE id = ?",
    values: [userId[0].user ?? false],
  });
  return result.map((account) => {
    account.password = undefined;
    account.financeToken = account.FinanceToken;
    account.FinanceToken = undefined;
    account.authorizeToken = undefined;
    account.verifyToken = undefined;
    account.onboarding = parseInt(account.onboarding);
    account.notificationMin = parseInt(account.notificationMin);
    account.studentMode = isJsonString(account.studentMode)
      ? JSON.parse(account.studentMode)
      : account.studentMode === "on"
      ? true
      : false;
    account.darkMode = JSON.parse(account.darkMode);

    if (account.SyncToken === "false")
      account.syncToken = JSON.parse(account.SyncToken);
    return account;
  })[0];
};
