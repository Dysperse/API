import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  res.setHeader(
    "Set-Cookie",
    serialize("token", "", {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 4, // 1 month
    })
  );
  // res.json({ success: true, key: encoded });
  res.redirect("/dashboard");
}
