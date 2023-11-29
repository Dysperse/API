// Update user settings
import { getApiParam, getSessionToken } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import * as twofactor from "node-2fa";

export async function GET(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const secret = await getApiParam(req, "secret", false);
  const code = await getApiParam(req, "code", true);

  const session = await prisma.session.findUnique({
    where: {
      id: sessionToken,
    },
    select: {
      user: {
        select: {
          id: true,
        },
      },
    },
  });

  if (!session) {
    return Response.json({ error: "Unauthorized" });
  }
  const userId = session.user.id;
  twofactor.generateToken(secret);
  const login = twofactor.verifyToken(secret, code);

  if (!login || login.delta !== 0) {
    return Response.json({ error: "Invalid code" });
  }

  const user = await prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      twoFactorSecret: secret,
    },
  });

  return Response.json(user);
}
