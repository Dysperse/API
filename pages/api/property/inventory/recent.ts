import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.item.findMany({
      where: {
        AND: [{ propertyId: req.query.property }, { id: req.query.id }],
      },
      take: 10,
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
