import executeQuery from "./db";

export const ExchangeToken = async (token: string) => {
  const result = await executeQuery({
    query: "SELECT * FROM UserTokens WHERE token = ?",
    values: [token],
  });
  return [...result];
};
