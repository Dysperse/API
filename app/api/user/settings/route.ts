// Update user settings
import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const sessionToken = getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const name = getApiParam(req, "name", false);
  const username = getApiParam(req, "username", false);
  const lastReleaseVersionViewed = getApiParam(
    req,
    "lastReleaseVersionViewed",
    false
  );
  const twoFactorSecret = getApiParam(req, "twoFactorSecret", false);
  const darkMode = getApiParam(req, "darkMode", false);
  const agreeTos = getApiParam(req, "agreeTos", false);
  const color = getApiParam(req, "color", false);

  const user = await prisma.user.update({
    where: {
      identifier: userIdentifier,
    },
    data: {
      name: name || undefined,
      ...(username && {
        username:
          username
            .replace(/\s+/g, "_")
            .toLowerCase()
            .replace(/[^a-z0-9_.]/g, "") || undefined,
      }),
      lastReleaseVersionViewed: parseInt(lastReleaseVersionViewed) || undefined,
      twoFactorSecret: twoFactorSecret === "" ? "" : undefined,
      ...(darkMode && { darkMode }),
      ...(agreeTos && { agreeTos: agreeTos === "true" }),
      color: color || undefined,
    },
  });
  return Response.json(user);
}
