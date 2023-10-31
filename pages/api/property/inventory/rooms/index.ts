import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.room.findMany({
      where: {
        propertyId: req.query.property,
      },
      include: {
        _count: true,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
