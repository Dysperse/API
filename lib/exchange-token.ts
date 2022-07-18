import excuteQuery from "./db";

export const ExchangeToken = async (token: string) => {
  const result = await excuteQuery({
    query: "SELECT * FROM UserTokens WHERE token = ?",
    values: [token],
  });
  return [...result];
};
