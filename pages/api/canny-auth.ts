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

var PrivateKey = "a0b644ac-84fc-2713-9969-faa145b8c8e3";

function createCannyToken(user) {
  var userData = {
    avatarURL: user.avatarURL, // optional, but preferred
    email: user.email,
    id: user.id,
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
