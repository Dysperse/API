import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.room.create({
      data: {
        name: req.query.name,
        emoji: req.query.emoji,
        note: req.query.note,
        private: req.query.private === "true",
        property: { connect: { id: req.query.property } },
        createdBy: { connect: { identifier: req.query.userIdentifier } },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
