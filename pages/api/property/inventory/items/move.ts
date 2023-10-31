import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    //   Update the note on an item
    const data = await prisma.item.update({
      where: { id: req.query.id },
      data: {
        room: { connect: { id: req.query.room } },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
