// Update user settings
import { getApiParam, getSessionToken } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import * as twofactor from "node-2fa";

export async function GET(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const code = await getApiParam(req, "code", true);

  // Get user info from sessions table using accessToken
  const session = await prisma.session.findUnique({
    where: {
      id: sessionToken,
    },
    select: {
      user: {
        select: {
          twoFactorSecret: true,
        },
      },
    },
  });
  if (!session) {
    return Response.json({ error: "Unauthorized" });
  }
  const twoFactorSecret = session.user.twoFactorSecret;
  twofactor.generateToken(twoFactorSecret);
  const login: null | { delta: number } = twofactor.verifyToken(
    twoFactorSecret,
    code
  );

  return Response.json({
    success: login && login.delta === 0,
  });
}
