import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

// copy collection
export async function POST(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const copy = await prisma.collection.findFirstOrThrow({
      where: { id: params.id },
      include: { labels: true },
    });

    const data = await prisma.collection.create({
      data: {
        name: copy.name,
        description: copy.description,
        defaultView: copy.defaultView,
        category: copy.category,
        emoji: copy.emoji,
        kanbanOrder: copy.kanbanOrder || undefined,
        gridOrder: copy.gridOrder || undefined,
        createdBy: { connect: { id: userId } },
        labels: {
          create: copy.labels.map((label) => ({
            name: label.name,
            emoji: label.emoji,
            color: label.color,
            createdBy: { connect: { id: userId } },
            space: { connect: { id: spaceId } },
          })),
        },
        space: { connect: { id: spaceId } },
        shareItems: copy.shareItems,
        keepAuthorAnonymous: copy.keepAuthorAnonymous,
        showCompleted: copy.showCompleted,
        originalCollectionTemplate: { connect: { id: copy.id } },
        keepProfileAnonymous: copy.keepProfileAnonymous,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "cursor", required: false },
      { name: "id", required: false },
      { name: "category", required: false },
      { name: "search", required: false },
    ]);

    const data = await prisma.collection.findMany({
      where: {
        AND: [
          params.id && { id: params.id },
          { public: true },
          params.category && { category: params.category },
          params.defaultView && { defaultView: params.defaultView },
          params.search && {
            OR: [
              { name: { contains: params.search } },
              { description: { contains: params.search } },
            ],
          },
        ].filter((t) => t),
      },
      select: {
        id: true,
        name: true,
        defaultView: true,
        emoji: true,
        category: true,
        kanbanOrder: true,
        gridOrder: true,
        shareItems: true,
        description: true,
        keepAuthorAnonymous: true,
        showCompleted: true,
        labels: { select: { name: true, emoji: true, color: true } },
        createdBy: {
          select: {
            email: true,
            profile: {
              select: { name: true, picture: true, theme: true },
            },
            id: true,
          },
        },
      },
      take: 50,
      cursor: params.cursor ? { id: params.cursor } : undefined,
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
