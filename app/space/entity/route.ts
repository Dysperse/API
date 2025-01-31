import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { prisma } from "@/lib/prisma";
import { generateRandomString } from "@/lib/randomString";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { entitiesSelection } from "../collections/collection/entitiesSelection";
import { omit } from "../collections/collection/omit";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export const nonReadOnlyPermissionArgs = (
  userId: string,
  params,
  spaceId
): Prisma.EntityWhereInput => ({
  OR: [
    // For people within the space
    {
      AND: [
        { id: params.id },
        // { spaceId }
      ],
    },
    // For people outside the space but invited
    {
      // If we're referencing a collection from the label it's given
      AND: [
        { collection: null },
        { spaceId },
        {
          collection: {
            invitedUsers: {
              some: {
                AND: [
                  { userId },
                  { access: { not: "READ_ONLY" } },
                  { id: params.id },
                ],
              },
            },
          },
        },
      ],
    },
    {
      AND: [
        { label: null },
        { label: { spaceId } },
        {
          label: {
            collections: {
              some: {
                invitedUsers: {
                  some: {
                    AND: [
                      { userId },
                      { access: { not: "READ_ONLY" } },
                      { id: params.id },
                    ],
                  },
                },
              },
            },
          },
        },
      ],
    },
  ],
});

export async function POST(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();

    const params = await getApiParams(
      req,
      [
        { name: "name", required: true },
        { name: "type", required: true },
        { name: "note", required: false },
        { name: "attachments", required: false },
        { name: "start", required: false },
        { name: "end", required: false },
        { name: "dateOnly", required: false },
        { name: "pinned", required: false },
        { name: "labelId", required: false },
        { name: "location", required: false },
        { name: "recurrenceRule", required: false },
        { name: "notifications", required: false },
        { name: "agendaOrder", required: false },
        { name: "collectionId", required: false },
        { name: "storyPoints", required: false },
        { name: "parentId", required: false },
      ],
      { type: "BODY" }
    );

    const isPublished = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { privateTasks: true },
    });

    const space = await prisma.entity.create({
      data: {
        name: params.name,
        type: params.type,
        note: params.note,
        published: !isPublished.privateTasks,
        storyPoints: params.storyPoints,
        agendaOrder: params.agendaOrder || "0|hzzzzz:",
        start: params.start ? new Date(params.start) : undefined,
        location: params.location || undefined,
        end: params.end ? new Date(params.end) : undefined,
        dateOnly: Boolean(params.dateOnly ?? true),
        pinned: Boolean(params.pinned ?? false),
        notifications: params.notifications,
        shortId: generateRandomString(10),
        recurrenceRule: params.recurrenceRule,
        attachments: params.attachments,
        parentTask: params.parentId
          ? { connect: { id: params.parentId } }
          : undefined,
        collection: params.collectionId
          ? { connect: { id: params.collectionId } }
          : undefined,
        label: params.labelId
          ? {
              connect: {
                id: params.labelId,
              },
            }
          : undefined,
        space: {
          connect: {
            id: spaceId,
          },
        },
      },
      include: {
        completionInstances: true,
        label: true,
      },
    });

    await incrementUserInsight(userId, "tasksCreated");

    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PATCH(req: NextRequest) {
  // Used for creating multiple entities at once. Passed an array of objects

  try {
    const { spaceId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [{ name: "entities", required: true }],
      { type: "BODY" }
    );

    const data = await prisma.$transaction(
      params.entities.map((entity) => {
        return prisma.entity.create({
          ...omit(["where"], entitiesSelection),
          data: {
            type: "TASK",
            name: entity.name,
            labelId: entity.labelId,
            pinned: entity.pinned,
            start: entity.start ? new Date(entity.start) : undefined,
            end: entity.end ? new Date(entity.end) : undefined,
            note: entity.note,
            recurrenceRule: entity.recurrenceRule,
            agendaOrder: entity.agendaOrder,
            parentTask: entity.parentId
              ? { connect: { id: entity.parentId } }
              : undefined,
            notifications: entity.notifications,
            attachments: entity.attachments,
            storyPoints: entity.storyPoints,
            location: entity.location,
            published: entity.published,
            trash: entity.trash,
            space: {
              connect: {
                id: spaceId,
              },
            },
          },
        });
      })
    );
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "inviteLinkId", required: false },
    ]);
    const { userId } = await getIdentifiers(
      undefined,
      Boolean(params.inviteLinkId)
    );

    const t = {
      completionInstances: true,
      label: true,
      collection: true,
      space: {
        select: {
          name: true,
          id: true,
        },
      },
    };

    const data = await prisma.entity.findFirstOrThrow({
      where: {
        OR: [
          // For people within the space
          { AND: [{ id: params.id }] },

          // For people outside the space but invited
          {
            AND: [
              { id: params.id },
              { collection: { invitedUsers: { some: { userId } } } },
            ],
          },
          {
            AND: params.inviteLinkId
              ? [
                  { id: params.id },
                  { collection: { inviteLink: { id: params.inviteLinkId } } },
                ]
              : [],
          },
          {
            AND: [
              { id: params.id },
              {
                label: {
                  collections: { some: { invitedUsers: { some: { userId } } } },
                },
              },
            ],
          },
        ],
      },
      include: {
        ...t,
        integration: true,
        subtasks: { include: t, where: { trash: false } },
      },
    });

    return Response.json({
      ...data,
      subtasks: data.subtasks.reduce((acc, subtask) => {
        acc[subtask.id] = subtask;
        return acc;
      }, {}),
    });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);
    const data = await prisma.entity.updateMany({
      where: nonReadOnlyPermissionArgs(userId, params, spaceId),
      data: {
        trash: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "name", required: false },
        { name: "pinned", required: false },
        { name: "start", required: false },
        { name: "dateOnly", required: false },
        { name: "end", required: false },
        { name: "note", required: false },
        { name: "labelId", required: false },
        { name: "location", required: false },
        { name: "trash", required: false },
        { name: "recurrenceRule", required: false },
        { name: "agendaOrder", required: false },
        { name: "notifications", required: false },
        { name: "attachments", required: false },
        { name: "storyPoints", required: false },
        { name: "published", required: false },
      ],
      { type: "BODY" }
    );
    const data = await prisma.entity.updateMany({
      where: nonReadOnlyPermissionArgs(
        userId,
        typeof params.id === "string"
          ? { id: params.id }
          : { id: { in: params.id } },
        spaceId
      ),
      data: {
        name: params.name ?? undefined,
        labelId: params.labelId ?? undefined,
        pinned: typeof params.pinned === "boolean" ? params.pinned : undefined,
        start: params.start
          ? new Date(params.start)
          : params.start === null
          ? null
          : undefined,
        end: params.end ? new Date(params.end) : undefined,
        attachments: params.attachments,
        notifications: params.notifications || undefined,
        dateOnly:
          typeof params.dateOnly === "boolean" ? params.dateOnly : undefined,
        hasSimplifiedNote:
          typeof params.hasSimplifiedNote === "boolean"
            ? params.hasSimplifiedNote
            : undefined,
        storyPoints:
          params.storyPoints === null ? null : params.storyPoints || undefined,
        published:
          typeof params.published === "boolean" ? params.published : undefined,
        note:
          typeof params.note === "string"
            ? params.note
            : params.note === null
            ? null
            : undefined,
        recurrenceRule:
          typeof params.recurrenceRule !== "undefined"
            ? params.recurrenceRule
            : undefined,
        location:
          typeof params.location !== "undefined" ? params.location : undefined,
        agendaOrder:
          typeof params.agendaOrder === "string"
            ? params.agendaOrder
            : undefined,
        trash: typeof params.trash === "boolean" ? params.trash : undefined,
      },
    });

    if (
      typeof params.start !== "undefined" ||
      typeof params.end !== "undefined"
    )
      await incrementUserInsight(userId, "tasksRescheduled");

    if (params.trash === true)
      await incrementUserInsight(userId, "tasksDeleted");

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

