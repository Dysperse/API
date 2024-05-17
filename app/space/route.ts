import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
const STORAGE_UNITS = {
  max: 1000,
  entityMultipliers: {
    task: 1.5,
    note: 1.7,
    labels: 2,
    collections: 10,
  },
};

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function PUT(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();

    const { name, color, pattern, weekStart, vanishMode } = await getApiParams(
      req,
      [
        { name: "name", required: false },
        { name: "color", required: false },
        { name: "pattern", required: false },
        { name: "weekStart", required: false },
        { name: "vanishMode", required: false },
      ]
    );

    const space = await prisma.space.updateMany({
      where: {
        AND: [
          { id: spaceId },
          {
            members: {
              some: {
                AND: [{ userId }, { access: { in: ["OWNER", "ADMIN"] } }],
              },
            },
          },
        ],
      },
      data: {
        name: name || undefined,
        color: color || undefined,
        pattern: pattern || undefined,
        weekStart: weekStart || undefined,
        vanishMode: vanishMode || undefined,
      },
    });

    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}

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
        weekStart: true,
        vanishMode: true,
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
    const noteBreakdown =
      STORAGE_UNITS.entityMultipliers.note * grouped.NOTE || 0;
    const labelBreakdown =
      STORAGE_UNITS.entityMultipliers.labels * space._count.labels || 0;
    const collectionBreakdown =
      STORAGE_UNITS.entityMultipliers.collections * space._count.collections ||
      0;

    const storage = {
      limit: STORAGE_UNITS.max,
      used: taskBreakdown + noteBreakdown + labelBreakdown,
      breakdown: {
        tasks: taskBreakdown,
        notes: noteBreakdown,
        labels: labelBreakdown,
        collections: collectionBreakdown,
      },
    };

    return Response.json({
      ...space,
      entities: undefined,
      storage,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
