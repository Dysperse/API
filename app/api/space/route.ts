import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import { createInboxNotification } from "./inbox/createInboxNotification";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const propertyId = req.nextUrl.searchParams.get("propertyId");
    if (!propertyId) throw new Error("Missing parameters");

    const space = await prisma.session.findFirstOrThrow({
      where: { id: sessionToken },
      select: {
        user: {
          select: {
            properties: {
              where: { propertyId },
              include: { profile: true },
              take: 1,
            },
          },
        },
      },
    });

    return Response.json(space.user.properties[0]);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);
    const userName = getApiParam(req, "userName", true);
    const changedKey = getApiParam(req, "changedKey", true);
    const changedValue = getApiParam(req, "changedValue", true);
    const timestamp = getApiParam(req, "timestamp", true);
    const type = getApiParam(req, "type", false);
    const name = getApiParam(req, "name", false);
    const color = getApiParam(req, "color", false);
    const vanishingTasks = getApiParam(req, "vanishingTasks", false);

    await createInboxNotification(
      userName,
      `changed the ${changedKey} of the group to "${changedValue}"`,
      new Date(timestamp),
      spaceId
    );

    const data = await prisma.property.update({
      where: {
        id: spaceId,
      },
      data: {
        name: name || undefined,
        type: type || undefined,
        color: color || undefined,
        vanishingTasks: vanishingTasks === "true",
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}