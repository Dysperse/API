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
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);

    const data = await prisma.integration.findMany({
      where: { property: { id: spaceId } },
      include: { board: { select: { name: true, id: true } } },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionId);

    const name = await getApiParam(req, "name", true);
    const inputParams = await getApiParam(req, "inputParams", true);
    const outputType = await getApiParam(req, "outputType", true);
    const boardId = await getApiParam(req, "boardId", false);

    const data = await prisma.integration.create({
      data: {
        name: name,
        inputParams: inputParams,
        outputType: outputType,
        property: { connect: { id: spaceId } },
        user: { connect: { identifier: userIdentifier } },
        ...(boardId && {
          board: { connect: { id: boardId } },
        }),
      },
    });

    if (boardId && spaceId) {
      await prisma.column.deleteMany({
        where: {
          AND: [{ boardId: boardId }, { board: { property: { id: spaceId } } }],
        },
      });
    }

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = await getApiParam(req, "id", true);
    const data = await prisma.integration.delete({
      where: { id },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
