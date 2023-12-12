import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const _tabs = await getApiParam(req, "tabs", true);
  const tabs = JSON.parse(_tabs);
  /**
   * [
    {
        "id": "2e110534-8094-4185-acbc-12eb462e8dc2",
        "order": 0
    },
    {
        "id": "e3b73a82-7216-4443-a8aa-4286be10914d",
        "order": 1
    },
    {
        "id": "543c8abb-ce34-4329-9994-2de6d0226e46",
        "order": 2
    }
    ]
   */

  // Set all tabs to correct order

  const data = await Promise.all(
    tabs.map(async (tab) => {
      const { id, order } = tab;
      const tabData = await prisma.openTab.updateMany({
        where: {
          AND: [{ user: { identifier: userIdentifier } }, { id }],
        },
        data: { order },
      });
      return tabData;
    })
  );

  return Response.json(data);
}
