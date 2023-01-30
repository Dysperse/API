import jwt from "jsonwebtoken";
import { getUserData } from "../user/info";

/**
 * Get session data from the auth cookie
 * @param {any} providedToken
 * @returns {any}
 */
export const sessionData = async (providedToken) => {
  // console.log("providedToken", providedToken);
  const { accessToken } = jwt.verify(
    providedToken,
    process.env.SECRET_COOKIE_PASSWORD
  );
  const token: string = accessToken;
  const info = await getUserData(token);
  return JSON.parse(JSON.stringify(info));
};

const PrivateKey = process.env.CANNY_AUTH_PRIVATE_KEY;

/**
 * Create a Canny token
 * @param {any} user
 * @returns {any}
 */
function createCannyToken(user) {
  const userData = {
    avatarURL: user.avatarURL, // optional, but preferred
    email: user.email,
    id: user.id,
    name: user.name,
  };
  return jwt.sign(userData, PrivateKey, { algorithm: "HS256" });
}

/**
 * Handler function for the /api/canny-auth endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const info = await sessionData(req.cookies.token);
  const cannyToken = createCannyToken({
    avatarURL: info.user.image,
    email: info.user.email,
    id: req.cookies.token,
    name: info.user.name,
  });
  res.send(cannyToken);
};

export default handler;
