import { getLabelOrder } from "@/app/collections/getLabelOrder";
import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { entitiesSelection } from "./entitiesSelection";
import { inviteLinkParams } from "./planner/inviteLinkParams";

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
      { name: "pinCode", required: false },
    ]);
    const { userId, spaceId } = await getIdentifiers(
      undefined,
      params.isPublic === "true"
    );

    if (params.all) {
      let labeledEntities = await prisma.label.findMany({
        where: { spaceId },
        include: {
          _count: true,
          entities: entitiesSelection,
        },
      });
      let unlabeledEntities = await prisma.entity.findMany({
        ...entitiesSelection,
        where: {
          AND: [{ spaceId }, { label: null }, { trash: false }],
        },
      });

      labeledEntities = (labeledEntities as any).map((label) => ({
        ...label,
        entities: label.entities.reduce((acc, entity) => {
          acc[entity.id] = {
            ...entity,
            subtasks: entity.subtasks.reduce((acc, subtask) => {
              acc[subtask.id] = subtask;
              return acc;
            }, {}),
          };
          return acc;
        }, {}),
      })) as any;

      unlabeledEntities = (unlabeledEntities as any).reduce((acc, entity) => {
        acc[entity.id] = {
          ...entity,
          subtasks: entity.subtasks.reduce((acc, subtask) => {
            acc[subtask.id] = subtask;
            return acc;
          }, {}),
        };
        return acc;
      }, {}) as any;

      return Response.json({
        gridOrder: labeledEntities.map((label) => label.id),
        kanbanOrder: labeledEntities.map((label) => label.id),
        listOrder: labeledEntities.map((label) => label.id),
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
          { AND: [{ invitedUsers: { some: { userId } } }, { id: params.id }] },
          // todo: AND: [{ id: params.id }, { access: "..." }]
          { inviteLink: inviteLinkParams(params.id) },
        ],
      },
      include: {
        _count: true,
        integration: true,
        createdBy: {
          select: {
            email: true,
            profile: { select: { name: true, picture: true } },
          },
        },
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
    data.listOrder = getLabelOrder(data, "listOrder");

    // Convert label.entities to object with id as key, using a very performant data structure
    data.labels = data.labels.map((label) => ({
      ...label,
      entities: label.entities.reduce((acc, entity) => {
        acc[entity.id] = entity;
        return acc;
      }, {}),
    })) as any;

    data.entities = data.entities.reduce((acc, entity) => {
      acc[entity.id] = entity;
      return acc;
    }, {}) as any;

    if (
      data.pinCode &&
      (dayjs(data.pinAuthorizationExpiresAt).isBefore(dayjs()) ||
        !data.pinAuthorizationExpiresAt)
    ) {
      return Response.json({
        id: data.id,
        error: true,
        name: data.name,
        emoji: data.emoji,
        pinAuthorizationExpiresAt: data.pinAuthorizationExpiresAt,
        pinCodeError: data.pinCode ? "REQUIRED" : "NOT_SET",
      });
    }

    return Response.json({ ...data, access: foundInviteId });
  } catch (e) {
    return handleApiError(e);
  }
}

