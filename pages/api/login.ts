import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const encoded = jwt.sign(req.query.token, process.env.SECRET_COOKIE_PASSWORD, { expiresIn: "7d" });
  res.setHeader("Set-Cookie", serialize("token", encoded, { path: "/" }));
  // res.json({ success: true, key: encoded });
  res.redirect("/");
}
