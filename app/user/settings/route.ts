// Update user settings
import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const name = await getApiParam(req, "name", false);
  const username = await getApiParam(req, "username", false);
  const lastReleaseVersionViewed = await getApiParam(
    req,
    "lastReleaseVersionViewed",
    false
  );
  const twoFactorSecret = await getApiParam(req, "twoFactorSecret", false);
  const darkMode = await getApiParam(req, "darkMode", false);
  const lastPlannedTasks = await getApiParam(req, "lastPlannedTasks", false);
  const homePagePattern = await getApiParam(req, "homePagePattern", false);
  const agreeTos = await getApiParam(req, "agreeTos", false);
  const color = await getApiParam(req, "color", false);
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
      ...(lastPlannedTasks && { lastPlannedTasks: new Date(lastPlannedTasks) }),
      ...(agreeTos && { agreeTos: agreeTos === "true" }),
      color: color || undefined,
      ...(homePagePattern && {
        homePagePattern: homePagePattern === "SOLID" ? null : homePagePattern,
      }),
    },
  });
  return Response.json(user);
}
