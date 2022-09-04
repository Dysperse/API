import jwt from "jsonwebtoken";
import { getUserData } from "./user/info";

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
  const info = await sessionData(req.cookies.token);
  res.json(info);
};

export default handler;
