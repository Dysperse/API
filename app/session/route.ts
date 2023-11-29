import { getUserData } from "@/lib/server/getUserData";
import { getApiParam } from "@/lib/server/helpers";
import { NextRequest } from "next/server";

/**
 * Get session data from the auth cookie
 * @param {any} providedToken
 * @returns {any}
 */
export const sessionData = async (token) => {
  const info = await getUserData(token);
  return JSON.parse(JSON.stringify(info));
};

/**
 * API route to get user data
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function POST(req: NextRequest) {
  const token = await getApiParam(req, "token", true);

  const info = await sessionData(token);
  if (info.user === false) {
    return Response.json({ error: true });
  }
  return Response.json(info);
}
