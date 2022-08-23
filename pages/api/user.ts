import jwt from "jsonwebtoken";
import { getInfo } from "./account/info";

export const sessionData = async (providedToken) => {
  const accessToken = jwt.verify(
    providedToken,
    process.env.SECRET_COOKIE_PASSWORD
  );
  const token: any = accessToken ?? "false";
  const info = await getInfo(token);
  return JSON.parse(JSON.stringify(info));
};

const handler = async (req, res) => {
  const info = await sessionData(req.cookies.token);
  res.json(info);
};

export default handler;
