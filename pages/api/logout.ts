// Remove `token` cookie
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    jwt.sign({}, process.env.SECRET_COOKIE_PASSWORD, {
      maxAge: -1,
      path: "/",
    })
  );
  res.json({ status: "ok" });
}
