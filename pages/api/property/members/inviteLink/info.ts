import { prisma } from "@/lib/server/prisma";

export async function GET(req: NextRequest) {
  try {
    const data = await prisma.propertyLinkInvite.findUnique({
      where: {
        token: req.query.token,
      },
      select: {
        property: true,
      },
    });

    return Response.json(data ? data : { error: "Invalid token" });
  } catch (e) {
    return handleApiError(e);
  }
}
