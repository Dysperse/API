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
        { name: "id", required: true },
        { name: "labels", required: true },
      ],
      { type: "BODY" }
    );

    const data = await prisma.$transaction(
      params.labels.map((label: any) =>
        prisma.label.create({
          data: {
            name: label.name,
            space: { connect: { id: spaceId } },
            createdBy: { connect: { id: userId } },
            emoji: "1f3f7",
            integrationParams: label.integrationParams,
          },
        })
      )
    );

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
