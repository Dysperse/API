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
        ...entitiesSelection,
        where: {
          AND: [
            { spaceId: identifiers.spaceId },
            { label: null },
            { trash: false },
          ],
        },
      });
      return Response.json({
        gridOrder: labeledEntities.map((label) => label.id),
        kanbanOrder: labeledEntities.map((label) => label.id),
        labels: labeledEntities,
        entities: unlabeledEntities,
      });
    }

    const { showCompleted } = await prisma.collection.findUniqueOrThrow({
      where: { id: params.id },
    });

    const foundInviteId = await prisma.collectionAccess.findFirst({
      where: {
        AND: [{ userId: identifiers.userId }, { collectionId: params.id }],
      },
    });

    let data = await prisma.collection.findFirstOrThrow({
      where: {
        OR: [
          { AND: [{ spaceId: identifiers.spaceId }, { id: params.id }] },
          foundInviteId?.id
            ? {
                invitedUsers: {
                  some: { id: foundInviteId.id },
                },
              }
            : {},
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
    if (!data.kanbanOrder) data.kanbanOrder = data.labels.map((i) => i.id);

    // if any of the data.labels is not in the gridOrder, add it
    data.labels.forEach((label) => {
      if (!(data as any).gridOrder.includes(label.id)) {
        (data as any).gridOrder.push(label.id);
      }
    });

    // if any of the data.labels is not in the kanbanOrder, add it
    data.labels.forEach((label) => {
      if (!(data as any).kanbanOrder.includes(label.id)) {
        (data as any).kanbanOrder.push(label.id);
      }
    });

    return Response.json({ ...data, access: foundInviteId });
  } catch (e) {
    return handleApiError(e);
  }
}
