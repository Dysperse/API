import { getLabelOrder } from "@/app/collections/getLabelOrder";
import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { entitiesSelection } from "./entitiesSelection";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};
export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "all", required: false },
      { name: "isPublic", required: false },
    ]);
    const { userId, spaceId } = await getIdentifiers(
      undefined,
      params.isPublic === "true"
    );

    if (params.all) {
      const labeledEntities = await prisma.label.findMany({
        where: { spaceId },
        include: {
          _count: true,
          entities: entitiesSelection,
        },
      });
      const unlabeledEntities = await prisma.entity.findMany({
        ...entitiesSelection,
        where: {
          AND: [{ spaceId }, { label: null }, { trash: false }],
        },
      });
      return Response.json({
        gridOrder: labeledEntities.map((label) => label.id),
        kanbanOrder: labeledEntities.map((label) => label.id),
        labels: labeledEntities,
        entities: unlabeledEntities,
      });
    }

    const foundInviteId = await prisma.collectionAccess.findFirst({
      where: {
        AND: [{ userId }, { collectionId: params.id }],
      },
    });

    let data = await prisma.collection.findFirstOrThrow({
      where: {
        OR: [
          { AND: [{ userId }, { id: params.id }] },
          {
            AND: [{ invitedUsers: { some: { userId } } }, { id: params.id }],
          },
          {
            inviteLink: {
              AND: [{ access: "READ_ONLY" }, { id: params.id }],
            },
          },
        ],
      },
      include: {
        _count: true,
        integration: true,
        space: {
          select: {
            name: true,
          },
        },
        invitedUsers: {
          select: {
            id: true,
            access: true,
            hasSeen: true,
            user: {
              select: {
                username: true,
                email: true,
                id: true,
                profile: {
                  select: {
                    theme: true,
                    name: true,
                    picture: true,
                  },
                },
              },
            },
          },
        },
        entities: {
          ...entitiesSelection,
          include: {
            ...entitiesSelection.include,
            _count: true,
          },
          where: {
            AND: [{ trash: false }, { label: null }],
          },
          /**
           * Select only where completionInstances are 0 (in case we need in future)
            {
              completionInstances: {
                none: { completedAt: { not: null } },
              },
            },
           */
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

    data.kanbanOrder = getLabelOrder(data, "kanbanOrder");
    data.gridOrder = getLabelOrder(data, "gridOrder");
    return Response.json({ ...data, access: foundInviteId });
  } catch (e) {
    return handleApiError(e);
  }
}

