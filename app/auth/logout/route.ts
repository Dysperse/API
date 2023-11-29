// Remove `token` cookie
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

/**
 * API handler for the /api/logout endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export function GET(req: NextRequest) {
  cookies().delete("token");
  return Response.json({ success: true });
}
