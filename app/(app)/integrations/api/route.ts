import { getSessionToken, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const propertyId = req.nextUrl.searchParams.get("propertyId");
    if (!propertyId) throw new Error("Missing parameters");

    const space = await prisma.session.findFirstOrThrow({
      where: { id: sessionToken },
      select: {
        user: {
          select: {
            properties: {
              where: { propertyId },
              select: { profile: { select: { Integration: true } } },
              take: 1,
            },
          },
        },
      },
    });

    return Response.json(space.user.properties[0].profile.Integration);
  } catch (e) {
    return handleApiError(e);
  }
}
