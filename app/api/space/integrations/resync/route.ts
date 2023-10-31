import { sessionData } from "@/app/api/session/route";
import { handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get("token");

    const session = await sessionData(token?.value);

    const data = await prisma.integration.findMany({
      where: {
        user: { identifier: session.user.identifier },
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
            user: session.user.identifier,
            timeZone: session.user.timeZone,
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
