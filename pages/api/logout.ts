// Remove `token` cookie
import jwt from "jsonwebtoken";
import { serialize } from "cookie";
export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",

    serialize("token", "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
    })
  );
  res.redirect("/");
}
