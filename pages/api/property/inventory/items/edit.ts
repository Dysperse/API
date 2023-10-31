import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    const data = await prisma.item.update({
      where: {
        id: req.query.id,
      },
      data: {
        ...(req.query.name && { name: req.query.name }),
        ...(req.query.note && { note: req.query.note }),
        ...(req.query.condition && { condition: req.query.condition }),
        ...(req.query.estimatedValue && {
          estimatedValue: Number(req.query.estimatedValue),
        }),
        ...(req.query.quantity && { quantity: req.query.quantity }),
        ...(req.query.starred && { starred: Boolean(req.query.starred) }),
        ...(req.query.serialNumber && { serialNumber: req.query.serialNumber }),
        ...(req.query.image && { image: req.query.image }),
        ...(req.query.categories && { categories: req.query.categories }),
        updatedAt: new Date(req.query.updatedAt),
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
