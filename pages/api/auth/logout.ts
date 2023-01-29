// Remove `token` cookie
import { serialize } from "cookie";
import cacheData from "memory-cache";

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

  cacheData.del(req.query.sessionId);
  res.status(200).json({})
}
