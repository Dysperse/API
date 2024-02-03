import { getApiParams } from "@/lib/getApiParams";
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
        collection: {
          include: { _count: true },
        },
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
