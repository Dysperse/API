import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import integrations from "../integrations.json";

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "id", required: false }]);
    const data = await prisma.integration.findMany({
      where: params.id ? { id: params.id } : undefined,
      include: {
        createdBy: true,
      },
    });
    return Response.json(
      data.map((integration) => ({
        integration,
        about: integrations.find((i) => i.slug === integration.name),
      }))
    );
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    await prisma.$transaction([
      prisma.integration.deleteMany({
        where: {
          AND: [{ id: params.id }, { createdBy: { id: userId } }],
        },
      }),
      prisma.entity.deleteMany({
        where: {
          AND: [
            { integration: { id: params.id } },
            { integration: { createdBy: { id: userId } } },
          ],
        },
      }),
    ]);

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
