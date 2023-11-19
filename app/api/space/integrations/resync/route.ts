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
    const { userIdentifier, timeZone } = await getIdentifiers(sessionId);

    const data = await prisma.integration.findMany({
      where: {
        user: { identifier: userIdentifier },
      },
      include: {
        property: { select: { vanishingTasks: true } },
      },
    });

    const fetchPromises = data.map(async (integration) => {
      const path = integration.name.replaceAll(" ", "-").toLowerCase();

      // Return the fetch promise so that we can await all of them later.
      return fetch(
        `https://my.dysperse.com/api/space/integrations/run/${path}?${new URLSearchParams(
          {
            property: integration.propertyId.toString(),
            boardId: (integration.boardId || "").toString(),
            user: userIdentifier,
            timeZone,
            vanishingTasks: integration.property.vanishingTasks
              ? "true"
              : "false",
          }
        )}`
      );
    });

    // Use Promise.all to await all the fetch requests in parallel.
    await Promise.all(fetchPromises);

    return Response.json({});
  } catch (e) {
    return handleApiError(e);
  }
}
