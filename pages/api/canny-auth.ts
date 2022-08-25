import jwt from "jsonwebtoken";
import { getInfo } from "./account/info";

export const sessionData = async (providedToken) => {
  // console.log("providedToken", providedToken);
  const { accessToken } = jwt.verify(
    providedToken,
    process.env.SECRET_COOKIE_PASSWORD
  );
  const token: any = accessToken;
  const info = await getInfo(token);
  return JSON.parse(JSON.stringify(info));
};

const PrivateKey = process.env.CANNY_AUTH_PRIVATE_KEY;

function createCannyToken(user) {
  var userData = {
    avatarURL: user.avatarURL, // optional, but preferred
    email: user.email,
    id: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NUb2tlbiI6IjZiZDQ2Mjc5LTZiNzgtNGU0Ni1iODJmLTYyMGUwMDEzNTJhNiIsImlhdCI6MTY2MTMyMzI1MywiZXhwIjoxNjYxOTI4MDUzfQ.63b3VH6nqD6XO0MzeH1ml7f3XMVORV5gqt3lLI2GXq0",
    name: user.name,
  };
  return jwt.sign(userData, PrivateKey, { algorithm: "HS256" });
}

const handler = async (req, res) => {
  const info = await sessionData(req.cookies.token);
  const cannyToken = createCannyToken({
    avatarURL: info.account.image,
    email: info.account.email,
    id: req.cookies.token,
    name: info.account.name,
  });
  res.send(cannyToken);
};

export default handler;
