import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const property = getApiParam(req, "property", true);
  try {
    const data = await prisma.inboxItem.findMany({
      where: {
        property: { id: property },
      },
      orderBy: { id: "desc" },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
