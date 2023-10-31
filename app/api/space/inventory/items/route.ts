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
    const sessionToken = getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const id = getApiParam(req, "id", true);

    const item = await prisma.item.findFirstOrThrow({
      where: { id },
      include: {
        property: {
          select: { name: true, id: true },
        },
        room: {
          select: { name: true, id: true, emoji: true, private: true },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
            username: true,
            Profile: { select: { picture: true } },
          },
        },
      },
    });

    return Response.json(item);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = getApiParam(req, "id", true);
    const name = getApiParam(req, "name", false);
    const note = getApiParam(req, "note", false);
    const condition = getApiParam(req, "condition", false);
    const estimatedValue = getApiParam(req, "estimatedValue", false);
    const quantity = getApiParam(req, "quantity", false);
    const starred = getApiParam(req, "starred", false);
    const serialNumber = getApiParam(req, "serialNumber", false);
    const image = getApiParam(req, "image", false);
    const categories = getApiParam(req, "categories", false);
    const updatedAt = getApiParam(req, "updatedAt", false);

    const data = await prisma.item.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(note && { note }),
        ...(condition && { condition }),
        ...(estimatedValue && {
          estimatedValue: Number(estimatedValue),
        }),
        ...(quantity && { quantity }),
        ...(starred && { starred: Boolean(starred) }),
        ...(serialNumber && { serialNumber }),
        ...(image && { image }),
        ...(categories && { categories }),
        updatedAt: new Date(updatedAt),
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const id = getApiParam(req, "id", true);
    const item = await prisma.item.delete({
      where: { id },
    });

    return Response.json(item);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);

    const name = getApiParam(req, "name", false);
    const note = getApiParam(req, "note", false);
    const condition = getApiParam(req, "condition", false);
    const estimatedValue = getApiParam(req, "estimatedValue", false);
    const quantity = getApiParam(req, "quantity", false);
    const starred = getApiParam(req, "starred", false);
    const serialNumber = getApiParam(req, "serialNumber", false);
    const image = getApiParam(req, "image", false);
    const categories = getApiParam(req, "categories", false);
    const room = getApiParam(req, "room", true);

    const data = await prisma.item.create({
      data: {
        ...(name && { name }),
        ...(note && { note }),
        ...(condition && { condition }),
        ...(estimatedValue && {
          estimatedValue: Number(estimatedValue),
        }),
        ...(quantity && { quantity }),
        ...(starred && { starred: Boolean(starred) }),
        ...(serialNumber && { serialNumber }),
        ...(image && { image }),
        ...(categories && { categories }),

        room: { connect: { id: room } },
        property: { connect: { id: spaceId } },
        createdBy: { connect: { identifier: userIdentifier } },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
