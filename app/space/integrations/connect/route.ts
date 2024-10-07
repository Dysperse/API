import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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
        { name: "type", required: true },
        { name: "name", required: true },
        { name: "params", required: true },
      ],
      { type: "BODY" }
    );

    const data = await prisma.integration.create({
      data: {
        type: params.type,
        name: params.name,
        params: params.params,
        space: { connect: { id: spaceId } },
        createdBy: { connect: { id: userId } },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
