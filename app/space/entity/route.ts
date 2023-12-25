import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers(req);

    const params = await getApiParams(
      req,
      [
        { name: "name", required: true },
        { name: "type", required: true },
        { name: "note", required: false },
        { name: "due", required: false },
        { name: "dateOnly", required: false },
        { name: "pinned", required: false },
        { name: "notifications", required: false },
      ],
      { type: "BODY" }
    );

    const space = await prisma.entity.create({
      data: {
        name: params.name,
        type: params.type,
        note: params.note,
        due: params.due ? new Date(params.due) : undefined,
        dateOnly: Boolean(params.dateOnly ?? true),
        pinned: Boolean(params.pinned ?? false),
        notifications: params.notifications,

        createdBy: {
          connect: {
            id: userId,
          },
        },
        space: {
          connect: {
            id: spaceId,
          },
        },
      },
    });
    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}
