import { entitiesSelection } from "@/app/space/collections/collection/entitiesSelection";
import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { getLabelOrder } from "../getLabelOrder";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "groupBy", required: false },
      { name: "showCompleted", required: false },
    ]);

    if (
      !["DATE", "LABEL", "LABEL:KANBAN", "LABEL:GRID"].includes(
        params.groupBy
      ) &&
      params.groupBy !== null
    ) {
      throw new Error(
        "Invalid `groupBy`. Must be one type DATE, LABEL, or null."
      );
    }

    const _entitiesSelection = {
      ...entitiesSelection,
      where: {
        ...entitiesSelection.where,
        ...(params.showCompleted === "true"
          ? {}
          : {
              OR: [
                { recurrenceRule: { not: null } },
                {
                  completionInstances: {
                    none: { completedAt: { not: null } },
                  },
                },
              ],
            }),
      },
    } as Prisma.Label$entitiesArgs<DefaultArgs>;

    const collection = await prisma.collection.findFirstOrThrow({
      where: {
        OR: [
          // If the user is the owner of the collection
          {
            AND: [{ id: params.id }, { userId }],
          },
          // If the user is invited to the collection
          {
            AND: [{ id: params.id }, { invitedUsers: { some: { userId } } }],
          },
        ],
      },

      select: {
        kanbanOrder: true,
        gridOrder: true,
        entities: _entitiesSelection,
        labels: { include: { entities: _entitiesSelection } },
      },
    });

    switch (params.groupBy) {
      case "DATE":
        return Response.json(collection.labels);
      case "LABEL":
        return Response.json({
          labels: collection.labels,
          entities: collection.entities,
        });
      case "LABEL:KANBAN":
        const kanbanOrder = getLabelOrder(collection);

        return Response.json({
          order: kanbanOrder,
          labels: kanbanOrder.map((id: string) =>
            collection.labels.find((label) => label.id === id)
          ),
          entities: collection.entities,
        });
      case null:
        return Response.json([
          ...(collection as any).labels.reduce(
            (acc, label) => [...acc, ...label.entities],
            []
          ),
          ...collection.entities,
        ]);
    }
  } catch (e) {
    return handleApiError(e);
  }
}
