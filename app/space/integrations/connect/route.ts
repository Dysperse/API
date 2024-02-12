import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: false },
        { name: "labels", required: true },

        // for creating a new integration
        { name: "createIntegration", required: false },
        { name: "integration", required: false },
        { name: "params", required: false },
      ],
      { type: "BODY" }
    );

    let integrationId = params.id;

    if (params.createIntegration) {
      const d = await prisma.integration.create({
        data: {
          name: params.integration,
          params: params.params,
          space: { connect: { id: spaceId } },
          createdBy: { connect: { id: userId } },
        },
      });
      integrationId = d.id;
    }

    const data = await prisma.$transaction(
      params.labels.map((label: any) =>
        prisma.label.create({
          data: {
            name: label.name,
            space: { connect: { id: spaceId } },
            createdBy: { connect: { id: userId } },
            emoji: label.emoji || "1f3f7",
            color: label.color || "blue",
            integrationParams: label.integrationParams,
            integration: { connect: { id: integrationId } },
          },
        })
      )
    );

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
