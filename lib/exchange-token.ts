import executeQuery from "./db";

export const ExchangeToken = async (token: string) => {
  const result = await executeQuery({
    query: "SELECT * FROM UserTokens WHERE token = ?",
    values: [token],
  });
  if (!result[0]) return false;
  return [...result][0].user;
};
