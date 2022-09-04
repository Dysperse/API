import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const encoded = jwt.sign(
    {
      exp: "7d",
      data: {
        accessToken: req.query.token,
      },
    },
    process.env.SECRET_COOKIE_PASSWORD
  );
  let now = new Date();
  now.setDate(now.getDate() * 7 * 4);

  res.setHeader(
    "Set-Cookie",
    serialize("token", encoded, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7 * 4, // 1 month
      expires: now,
    })
  );
  // res.json({ success: true, key: encoded });
  res.redirect("/dashboard");
}
