import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export default function handler(req, res) {
  const encoded = jwt.sign(
    { accessToken: req.query.token },
    process.env.SECRET_COOKIE_PASSWORD,
    { expiresIn: "7d" }
  );

  res.setHeader(
    "Set-Cookie",
    serialize("token", encoded, {
      path: "/",
      expires: new Date("Tue, 15 Jan 5000 21:47:38 GMT"),
    })
  );
  // res.json({ success: true, key: encoded });
  res.redirect("/dashboard");
}
