import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const order = await getApiParam(req, "order", true);

    const orderObj = JSON.parse(order);

    orderObj.forEach(async (column) => {
      await prisma.column.updateMany({
        where: {
          AND: [{ id: column.id }, { board: { property: { id: spaceId } } }],
        },
        data: {
          order: column.order,
        },
      });
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
