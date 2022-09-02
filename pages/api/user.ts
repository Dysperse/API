import jwt from "jsonwebtoken";
import { getUserData } from "./account/info";

export const sessionData = async (providedToken) => {
  // console.log("providedToken", providedToken);
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
