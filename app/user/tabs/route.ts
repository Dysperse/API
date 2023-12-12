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
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const tabs = await prisma.openTab.findMany({
      where: {
        userId: userIdentifier,
      },
    });

    return Response.json(tabs);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const tabData = await getApiParam(req, "tabData", false);
  const boardId = await getApiParam(req, "boardId", false);

  const tab = await prisma.openTab.create({
    data: {
      ...(tabData && { tabData: JSON.parse(tabData) }),
      ...(boardId && { board: { connect: { id: boardId } } }),
      userId: userIdentifier,
    },
  });

  return Response.json(tab);
}

export async function DELETE(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const id = await getApiParam(req, "id", true);

  const tab = await prisma.openTab.deleteMany({
    where: {
      AND: [{ user: { identifier: userIdentifier } }, { id }],
    },
  });

  return Response.json(tab);
}

export async function PUT(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionToken);

  const id = await getApiParam(req, "id", true);
  const tabData = await getApiParam(req, "tabData", false);

  const tab = await prisma.openTab.update({
    where: { id },
    data: {
      ...(tabData && { tabData: JSON.parse(tabData) }),
    },
  });

  return Response.json(tab);
}
