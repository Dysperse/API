import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
const STORAGE_UNITS = {
  max: 1000,
  entityMultipliers: {
    item: 1.5, // deprecated
    integration: 20,
    task: 1.5,
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
      },
    });

    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const { spaceId } = await getApiParams(req, [
      { name: "spaceId", required: true },
    ]);

    const space = await prisma.space.findFirstOrThrow({
      where: {
        id: spaceId,
      },
      select: {
        name: true,
        _count: true,
        entities: {
          select: {
            type: true,
            trash: true,
            start: true,
            recurrenceRule: true,
            _count: { select: { completionInstances: true } },
          },
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

    const referredCount = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        _count: {
          select: { referredUsers: true },
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

    const inTrash = space.entities
      .filter((e) => e.trash)
      .reduce((acc, curr) => {
        acc += STORAGE_UNITS.entityMultipliers[curr.type.toLowerCase()];
        return acc;
      }, 0);

    const entitiesInTrash = space.entities.filter((e) => e.trash).length;

    // Excluding recurring tasks
    const completeTasksCount = space.entities.filter(
      (e) => !e.recurrenceRule && e._count.completionInstances === 1 && !e.trash
    ).length;

    const taskBreakdown =
      STORAGE_UNITS.entityMultipliers.task * grouped.TASK || 0;
    const integrationBreakdown =
      STORAGE_UNITS.entityMultipliers.integration * space._count.integrations ||
      0;
    const labelBreakdown =
      STORAGE_UNITS.entityMultipliers.labels * space._count.labels || 0;
    const collectionBreakdown =
      STORAGE_UNITS.entityMultipliers.collections * space._count.collections ||
      0;

    const storage = {
      inTrash,
      entitiesInTrash,
      completeTasksCount,
      limit: STORAGE_UNITS.max + 25 * referredCount._count.referredUsers,
      used: taskBreakdown + integrationBreakdown + labelBreakdown,
      breakdown: {
        tasks: taskBreakdown,
        integrations: integrationBreakdown,
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
