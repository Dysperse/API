import { prisma } from "@/lib/server/prisma";
import { sessionData } from "../../session";

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

    for (const i in data) {
      const integration = data[i];
      const path = integration.name.replaceAll(" ", "-").toLowerCase();

      fetch(
        `https://my.dysperse.com/api/property/integrations/run/${path}?${new URLSearchParams(
          {
            property: integration.propertyId.toString(),
            boardId: (integration.boardId || "").toString(),
            timeZone: session.user.timeZone,
            vanishingTasks: integration.property.vanishingTasks
              ? "true"
              : "false",
          }
        )}`
      );
    }

    res.json({});
  } catch (e: any) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
}
