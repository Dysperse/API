import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "collection", required: true },
        { name: "labels", required: true },
      ],
      { type: "BODY" }
    );

    const data = await prisma.collection.create({
      data: {
        integrationId: params.id,
        name: params.collection.name,
        emoji: params.collection.emoji,
        labels: {
          create: params.labels.map(
            (label: any) =>
              ({
                name: label.name,
                createdBy: { connect: { id: userId } },
                emoji: "1f3f7",
                integrationParams: label.integrationParams,
              } as Prisma.LabelCreateWithoutCollectionsInput)
          ),
        },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
