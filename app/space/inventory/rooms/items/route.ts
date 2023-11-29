import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const id = await getApiParam(req, "id", true);
    const items = await getApiParam(req, "items", false);

    const data = await prisma.room.findFirstOrThrow({
      where: {
        AND: [{ propertyId: spaceId }, { id }],
      },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
        },
        ...(items === "false" && { items: false }),
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
