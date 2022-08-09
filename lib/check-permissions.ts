import executeQuery from "./db";

export const validatePerms = async (
  propertyToken: string,
  accessToken: string
) => {
  const result = await executeQuery({
    query:
      "SELECT * FROM SyncTokens WHERE propertyToken = ? AND accessToken = ?",
    values: [propertyToken, accessToken],
  });
  if (!result[0]) {
    return false;
  }
  return [...result][0].role;
};
