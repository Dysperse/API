import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { spaceId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const response = await prisma.collectionAccess.findMany({
      where: {
        AND: [{ collectionId: params.id }, { collection: { spaceId } }],
      },
      include: {},
    });
    return Response.json(response);
  } catch (e) {
    return handleApiError(e);
  }
}
