import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export async function GET(req: NextRequest) {
  try {
    validateParams(req.query, ["email"]);
    const data = await prisma.completionInstance.findMany({
      where: {
        task: {
          createdBy: {
            email: req.query.email,
          },
        },
      },
      include: {
        task: {
          select: {
            pinned: true,
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
