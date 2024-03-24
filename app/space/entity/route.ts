import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";
export const nonReadOnlyPermissionArgs = (
  userId: string,
  params,
  spaceId
): Prisma.EntityWhereInput => ({
  AND: [
    // For people within the space
    { AND: [{ id: params.id }, { spaceId }] },
    // For people outside the space but invited
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
});

export async function POST(req: NextRequest) {
  try {
    const { spaceId } = await getIdentifiers();

    const params = await getApiParams(
      req,
      [
        { name: "name", required: true },
        { name: "type", required: true },
        { name: "note", required: false },
        { name: "attachments", required: false },
        { name: "due", required: false },
        { name: "dateOnly", required: false },
        { name: "pinned", required: false },
        { name: "labelId", required: false },
        { name: "recurrenceRule", required: false },
        { name: "notifications", required: false },
        { name: "agendaOrder", required: false },
        { name: "collectionId", required: false },
      ],
      { type: "BODY" }
    );
    const space = await prisma.entity.create({
      data: {
        name: params.name,
        type: params.type,
        note: params.note,
        agendaOrder: params.agendaOrder || "0|hzzzzz:",
        due: params.due ? new Date(params.due) : undefined,
        dateOnly: Boolean(params.dateOnly ?? true),
        pinned: Boolean(params.pinned ?? false),
        notifications: params.notifications,
        recurrenceRule: params.recurrenceRule,
        attachments: params.attachments,
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
    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const data = await prisma.entity.findFirstOrThrow({
      where: {
        OR: [
          // For people within the space
          { AND: [{ id: params.id }, { spaceId }] },
          // For people outside the space but invited
          {
            AND: [
              { id: params.id },
              { collection: { invitedUsers: { some: { userId } } } },
            ],
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
        completionInstances: {
          take: 1,
        },
        label: true,
        space: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    console.log(data);
    return Response.json(data);
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
        { name: "due", required: false },
        { name: "note", required: false },
        { name: "labelId", required: false },
        { name: "trash", required: false },
        { name: "agendaOrder", required: false },
        { name: "attachments", required: false },
      ],
      { type: "BODY" }
    );
    const data = await prisma.entity.updateMany({
      where: nonReadOnlyPermissionArgs(userId, params, spaceId),
      data: {
        name: params.name ?? undefined,
        labelId: params.labelId ?? undefined,
        pinned: typeof params.pinned === "boolean" ? params.pinned : undefined,
        due: params.due ? new Date(params.due) : undefined,
        attachments: params.attachments,
        note:
          typeof params.note === "string"
            ? params.note
            : params.note === null
            ? null
            : undefined,
        agendaOrder:
          typeof params.agendaOrder === "string"
            ? params.agendaOrder
            : undefined,
        trash: typeof params.trash === "boolean" ? params.trash : undefined,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
