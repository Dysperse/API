import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { spaceId } = await getIdentifiers();

    const params = await getApiParams(req, [{ name: "type", required: true }]);

    const space = await prisma.entity.findMany({
      where: {
        AND: [{ type: params.type }, { spaceId }, { trash: false }],
      },
      include: {
        completionInstances: true,
        label: true,
      },
    });

    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}
