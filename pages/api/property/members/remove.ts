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
      req.query.removerName,
      `removed ${req.query.removeeName}`,
      new Date(req.query.timestamp),
      req.query.property,
      req.query.accessToken,
      req,
      res
    );
    //   Delete user from `propertyInvite` table
    const data = await prisma.propertyInvite.delete({
      where: { id: req.query.id },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
