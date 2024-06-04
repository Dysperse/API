import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

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
      const d = await prisma.integration.upsert({
        where: {
          id: params.id || "this-will-never-match",
        },
        update: {
          name: params.integration,
          params: params.params,
        },
        create: {
          id: uuidv4(),
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
        prisma.label.upsert({
          where: {
            id: label.id || "this-will-never-match",
          },
          update: {
            name: label.name || undefined,
            emoji: label.emoji || undefined,
            color: label.color || undefined,
          },
          create: {
            id: uuidv4(),
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
