import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "id", required: false }]);
    const data = await prisma.integration.findMany({
      where: { id: params.id },
      include: {
        collection: {
          include: { _count: true },
        },
        createdBy: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
