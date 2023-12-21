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
      ],
      { type: "BODY" }
    );

    const space = await prisma.entity.create({
      data: {
        name: params.name,
        type: params.type,
        note: params.note,

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
