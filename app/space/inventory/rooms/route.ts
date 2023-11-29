import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);

    const data = await prisma.room.findMany({
      where: {
        propertyId: spaceId,
      },
      include: {
        _count: true,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);

  const name = await getApiParam(req, "name", true);
  const emoji = await getApiParam(req, "emoji", true);
  const note = await getApiParam(req, "note", false);
  const _private = await getApiParam(req, "private", false);

  try {
    const data = await prisma.room.create({
      data: {
        name,
        emoji,
        note,
        private: _private === "true",
        property: { connect: { id: spaceId } },
        createdBy: { connect: { identifier: userIdentifier } },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
