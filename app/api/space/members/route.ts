import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import { createInboxNotification } from "../inbox/createInboxNotification";

export async function GET(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);

    const data = await prisma.propertyInvite.findMany({
      where: {
        propertyId: spaceId,
      },
      select: {
        id: true,
        permission: true,
        user: {
          select: {
            name: true,
            email: true,
            Profile: { select: { picture: true } },
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);
    const removerName = getApiParam(req, "removerName", true);
    const removeeName = getApiParam(req, "removeeName", true);
    const timestamp = getApiParam(req, "timestamp", true);
    const permission = getApiParam(req, "permission", true);
    const id = getApiParam(req, "id", true);

    await createInboxNotification(
      removerName,
      `removed ${removeeName}`,
      new Date(timestamp),
      spaceId
    );
    //   Delete user from `propertyInvite` table
    const data = await prisma.propertyInvite.delete({
      where: { id },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);

    const email = getApiParam(req, "email", true);
    const name = getApiParam(req, "name", true);
    const inviterName = getApiParam(req, "inviterName", true);
    const permission = getApiParam(req, "permission", true);
    const timestamp = getApiParam(req, "timestamp", true);

    // Find email from `user` table
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return Response.json({ error: "User not found" });
    }

    const userId = user.id;

    await createInboxNotification(
      inviterName,
      `invited ${name} with the permissions: ${permission}`,
      new Date(timestamp),
      spaceId
    );

    const data = await prisma.propertyInvite.create({
      data: {
        profile: {
          connect: { id: spaceId },
        },
        user: {
          connect: { id: userId },
        },
        accepted: false,
        selected: false,
        permission,
      },
      include: {
        profile: true,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);

    const changerName = getApiParam(req, "changerName", true);
    const affectedName = getApiParam(req, "affectedName", true);
    const permission = getApiParam(req, "permission", true);
    const timestamp = getApiParam(req, "timestamp", true);
    const id = getApiParam(req, "id", true);

    await createInboxNotification(
      changerName,
      `made ${affectedName} a ${permission}${
        permission === "read-only" ? " member" : ""
      }`,
      new Date(timestamp),
      spaceId
    );
    //   Delete user from `propertyInvite` table
    const data = await prisma.propertyInvite.update({
      where: { id },
      data: { permission },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
