// Remove `token` cookie
import { serialize } from "cookie";

/**
 * API handler for the /api/logout endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
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
