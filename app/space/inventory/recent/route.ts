import {
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);
    const data = await prisma.item.findMany({
      where: {
        property: {
          id: spaceId,
        },
      },
      take: 10,
      orderBy: { updatedAt: "desc" },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
