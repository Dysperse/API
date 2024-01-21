import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const entitiesSelection: Prisma.Collection$entitiesArgs<DefaultArgs> = {
      include: {
        completionInstances: true,
        label: true,
        attachments: {
          select: {
            data: true,
            type: true,
          },
        },
      },
      where: {
        trash: false,
      },
      // where: {
      //   OR: [
      //     { collection: { id: params.id } },
      //     { label: { collections: { some: { id: params.id } } } },
      //   ],
      // },
    };

    const data = await prisma.collection.findFirstOrThrow({
      where: {
        AND: [{ userId }, { id: params.id }],
      },
      include: {
        _count: true,
        entities: entitiesSelection,
        labels: {
          include: {
            entities: entitiesSelection,
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
