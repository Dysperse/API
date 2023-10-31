import { createInboxNotification } from "@/app/api/space/inbox/createInboxNotification";
import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "owner",
      credentials: [req.query.property, req.query.accessToken],
    });

    await createInboxNotification(
      req.query.changerName,
      `made ${req.query.affectedName} a ${req.query.permission}${
        req.query.permission === "read-only" ? " member" : ""
      }`,
      new Date(req.query.timestamp),
      req.query.property,
      req.query.accessToken,
      req,
      res
    );
    //   Delete user from `propertyInvite` table
    const data = await prisma.propertyInvite.update({
      where: {
        id: req.query.id,
      },
      data: {
        permission: req.query.permission,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
