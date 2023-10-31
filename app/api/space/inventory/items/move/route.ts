import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = getApiParam(req, "id", true);
    const room = getApiParam(req, "room", true);

    //   Update the note on an item
    const data = await prisma.item.update({
      where: { id: id },
      data: {
        room: { connect: { id: room } },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
