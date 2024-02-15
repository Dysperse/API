import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";

export function omit(keys, obj) {
  const filteredObj = { ...obj };
  keys.forEach((key) => delete filteredObj[key]);
  return filteredObj;
}

export const entitiesSelection: Prisma.Collection$entitiesArgs<DefaultArgs> = {
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
};

export async function GET(req: NextRequest) {
  try {
    const identifiers = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "all", required: false },
    ]);

    if (params.all) {
      const labeledEntities = await prisma.label.findMany({
        where: { spaceId: identifiers.spaceId },
        include: {
          _count: true,
          entities: entitiesSelection,
        },
      });
      const unlabeledEntities = await prisma.entity.findMany({
        where: {
          AND: [{ spaceId: identifiers.spaceId }, { label: null }],
        },
        ...entitiesSelection,
      });
      return Response.json({
        gridOrder: labeledEntities.map((label) => label.id),
        labels: labeledEntities,
        entities: unlabeledEntities,
      });
    }

    const { showCompleted } = await prisma.collection.findUniqueOrThrow({
      where: { id: params.id },
    });

    let data = await prisma.collection.findFirstOrThrow({
      where: {
        AND: [{ userId: identifiers.userId }, { id: params.id }],
      },
      include: {
        _count: true,
        integration: true,
        entities: {
          ...entitiesSelection,
          include: {
            ...entitiesSelection.include,
            _count: true,
          },
          where: {
            AND: [
              { trash: false },
              { label: null },
              { completionInstances: { some: { id: { not: "" } } } },
            ],
          },
        },
        labels: {
          include: {
            entities: {
              ...entitiesSelection,
              include: {
                ...entitiesSelection.include,
                _count: true,
              },
            },
          },
        },
      },
    });

    if (!data.gridOrder) data.gridOrder = data.labels.map((i) => i.id);

    // if any of the data.labels is not in the gridOrder, add it
    data.labels.forEach((label) => {
      if (!(data as any).gridOrder.includes(label.id)) {
        (data as any).gridOrder.push(label.id);
      }
    });

    if (!showCompleted) {
      // filter out completed tasks
      data.entities = data.entities.filter((entity) => {
        if (entity.completionInstances.length === 0) return true;
        return false;
      });
      data.labels = data.labels.map((label) => {
        label.entities = label.entities.filter((entity) => {
          if (entity.completionInstances.length === 0) return true;
          return false;
        });
        return label;
      });
    }
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
