import jwt from "jsonwebtoken";
import { getUserData } from "./user/info";

/**
 * Get session data from the auth cookie
 * @param {any} providedToken
 * @returns {any}
 */
export const sessionData = async (providedToken) => {
  const { accessToken } = jwt.verify(
    providedToken,
    process.env.SECRET_COOKIE_PASSWORD
  );
  const token: any = accessToken;
  const info = await getUserData(token);
  return JSON.parse(JSON.stringify(info));
};

const handler = async (req, res) => {
  if (req.cookies.token) {
    const info = await sessionData(req.cookies.token);
    res.json(info);
  } else {
    res.status(200).json({ error: true });
  }
};

export default handler;
