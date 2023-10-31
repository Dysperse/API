import { createInboxNotification } from "@/app/api/space/inbox/createInboxNotification";
import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const sessionToken = getSessionToken();
  const { spaceId } = await getIdentifiers(sessionToken);

  const inviterName = getApiParam(req, "inviterName", true);
  const timestamp = getApiParam(req, "timestamp", true);

  try {
    await createInboxNotification(
      inviterName,
      `created an invite link for this group`,
      new Date(timestamp),
      spaceId
    );

    // Get user id
    const data = await prisma.propertyLinkInvite.create({
      data: {
        property: {
          connect: {
            id: spaceId,
          },
        },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const token = getApiParam(req, "token", true);
    const data = await prisma.propertyLinkInvite.findFirstOrThrow({
      where: {
        token,
      },
      select: {
        property: true,
      },
    });

    return Response.json(data ? data : { error: "Invalid token" });
  } catch (e) {
    return handleApiError(e);
  }
}
