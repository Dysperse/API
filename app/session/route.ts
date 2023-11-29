import { getUserData } from "@/lib/server/getUserData";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * Get session data from the auth cookie
 * @param {any} providedToken
 * @returns {any}
 */
export const sessionData = async (providedToken) => {
  const { accessToken } = jwt.verify(
    providedToken,
    process.env.SECRET_COOKIE_PASSWORD
  );

  const token: string = accessToken;
  const info = await getUserData(token);

  return JSON.parse(JSON.stringify(info));
};

/**
 * API route to get user data
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function POST() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");

  if (token?.value) {
    const info = await sessionData(token?.value);
    if (info.user === false) {
      return Response.json({ error: true });
    }
    return Response.json(info);
  } else {
    return Response.json({ error: true });
  }
}
