import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const data = await prisma.notificationSettings.findUnique({
      where: { userId: userIdentifier },
    });
    await prisma.notificationSettings.findUnique({
      where: { userId: userIdentifier },
    });
    return Response.json(data || {});
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  const sessionToken = getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const name = getApiParam(req, "name", true);
  const value = getApiParam(req, "name", true);

  const user = await prisma.notificationSettings.upsert({
    where: {
      userId: userIdentifier,
    },
    update: {
      [name]: value === "true",
    },
    create: {
      user: {
        connect: {
          identifier: userIdentifier,
        },
      },
      [name]: value === "true",
    },
  });
  return Response.json(user);
}
