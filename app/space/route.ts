import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

const STORAGE_UNITS = {
  max: 1000,
  entityMultipliers: {
    task: 1.4,
    item: 1.3,
    note: 1.1,
    labels: 0.5,
    collections: 1.1,
  },
};

export async function GET(req: NextRequest) {
  try {
    const { spaceId } = await getApiParams(req, [
      { name: "spaceId", required: true },
    ]);

    const space = await prisma.space.findFirstOrThrow({
      where: {
        id: spaceId,
      },
      select: {
        name: true,
        color: true,
        pattern: true,
        _count: true,
        entities: {
          select: { type: true },
        },
        integrations: true,
        members: {
          select: {
            id: true,
            access: true,
            user: {
              select: {
                profile: {
                  select: {
                    name: true,
                    picture: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const grouped = space.entities.reduce((acc, curr) => {
      if (!acc[curr.type]) {
        acc[curr.type] = 0;
      }

      acc[curr.type]++;

      return acc;
    }, {} as Record<string, number>);

    const taskBreakdown =
      STORAGE_UNITS.entityMultipliers.task * grouped.TASK || 0;
    const itemBreakdown =
      STORAGE_UNITS.entityMultipliers.item * grouped.ITEM || 0;
    const noteBreakdown =
      STORAGE_UNITS.entityMultipliers.note * grouped.NOTE || 0;
    const labelBreakdown =
      STORAGE_UNITS.entityMultipliers.labels * space._count.labels || 0;
    const collectionBreakdown =
      STORAGE_UNITS.entityMultipliers.collections * space._count.collections ||
      0;

    const storage = {
      used: taskBreakdown + itemBreakdown + noteBreakdown + labelBreakdown,
      breakdown: {
        tasks: taskBreakdown,
        items: itemBreakdown,
        notes: noteBreakdown,
        labels: labelBreakdown,
        collections: collectionBreakdown,
      },
      limit: STORAGE_UNITS.max,
    };

    return Response.json({
      space: {
        ...space,
        entities: undefined,
      },
      storage,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
