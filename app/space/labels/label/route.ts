import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { entitiesSelection } from "../../collections/collection/route";

export async function GET(req: NextRequest) {
  try {
    const { spaceId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const data = await prisma.label.findFirstOrThrow({
      where: { AND: [{ id: params.id }, { spaceId }] },
      include: {
        _count: true,
        integration: true,
        collections: true,
        entities: {
          ...entitiesSelection,
          orderBy: { completionInstances: { _count: "asc" } },
        },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const data = await prisma.label.delete({
      where: { id: params.id },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
