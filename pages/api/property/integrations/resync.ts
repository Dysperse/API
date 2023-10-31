import { sessionData } from "@/app/api/session/route";
import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    const session = await sessionData(req.cookies.token);

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
        `https://my.dysperse.com/api/property/integrations/run/${path}?${new URLSearchParams(
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

    res.json({});
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
}
