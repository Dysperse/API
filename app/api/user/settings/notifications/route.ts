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
    const sessionToken = await getSessionToken();
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

export async function POST(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);
    const sub = await getApiParam(req, "sub", true);

    console.log(sub);
    const data = await prisma.notificationSettings.upsert({
      where: {
        userId: userIdentifier,
      },
      create: {
        pushSubscription: JSON.parse(sub),
        user: {
          connect: {
            identifier: userIdentifier,
          },
        },
      },
      update: {
        pushSubscription: JSON.parse(sub),
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const name = await getApiParam(req, "name", true);
  const value = await getApiParam(req, "name", true);

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
