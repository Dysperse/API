import jwt from "jsonwebtoken";
import cacheData from "memory-cache";
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

  const value = cacheData.get(accessToken);
  if (value) {
    return value;
  } else {
    const hours = 69;

    const token: string = accessToken;
    const info = await getUserData(token);

    cacheData.put(accessToken, info, hours * 1000 * 60 * 60);
    return JSON.parse(JSON.stringify(info));
  }
};

/**
 * API route to get user data
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const time1 = Date.now();
  if (req.cookies.token) {
    const info = await sessionData(req.cookies.token);
    const time2 = Date.now();
    console.log(`User data request took ${time2 - time1}ms`);
    res.json(info);
  } else {
    res.status(401).json({ error: true });
  }
};

export default handler;
