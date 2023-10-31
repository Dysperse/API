import { createInboxNotification } from "@/app/api/space/inbox/createInboxNotification";
import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "owner",
      credentials: [req.query.property, req.query.accessToken],
    });

    // Find email from `user` table
    const user = await prisma.user.findUnique({
      where: {
        email: req.query.email,
      },
    });

    if (!user) {
      res.status(401).json({ error: "User not found" });
      return;
    }
    // Get user id
    const userId = user.id;

    await createInboxNotification(
      req.query.inviterName,
      `invited ${user.name} with the permissions: ${req.query.permission}`,
      new Date(req.query.timestamp),
      req.query.property,
      req.query.accessToken,
      req,
      res
    );

    const data = await prisma.propertyInvite.create({
      data: {
        profile: {
          connect: { id: req.query.property },
        },
        user: {
          connect: { id: userId },
        },
        accepted: false,
        selected: false,
        permission: req.query.permission,
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
