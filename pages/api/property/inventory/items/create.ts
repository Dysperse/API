import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.item.create({
      data: {
        name: req.query.name,
        note: req.query.note == "null" ? null : req.query.note,
        room: { connect: { id: req.query.room } },
        property: { connect: { id: req.query.property } },
        createdBy: { connect: { identifier: req.query.userIdentifier } },
      },
      include: {},
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
