import { createInboxNotification } from "@/app/api/space/inbox/createInboxNotification";
import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    await createInboxNotification(
      req.query.inviterName,
      `created an invite link for this group`,
      new Date(req.query.timestamp),
      req.query.property,
    );

    // Get user id
    const data = await prisma.propertyLinkInvite.create({
      data: {
        property: {
          connect: {
            id: req.query.property,
          },
        },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
