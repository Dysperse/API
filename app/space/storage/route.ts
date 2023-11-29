import {
  getApiParam,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const propertyId = await getApiParam(req, "propertyId", true);

    const space = await prisma.session.findFirstOrThrow({
      where: { id: sessionToken },
      select: {
        user: {
          select: {
            properties: {
              where: { propertyId },
              select: { profile: { select: { _count: true } } },
              take: 1,
            },
          },
        },
      },
    });

    return Response.json(space.user.properties[0].profile);
  } catch (e) {
    return handleApiError(e);
  }
}
