import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { generateRandomString } from "@/lib/randomString";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const revalidate = 60 * 60 * 2; // 2 hours
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
      include: { labels: true, entities: true },
    });

    const collectionId = uuidv4();
    const labelMap = new Map<string, string>();

    const labels = copy.labels.map((label) => {
      const id = uuidv4();
      labelMap.set(label.id, id);

      return {
        name: label.name,
        emoji: label.emoji,
        color: label.color,
        createdBy: { connect: { id: userId } },
        space: { connect: { id: spaceId } },
      };
    });

    const data = await prisma.collection.create({
      data: {
        id: collectionId,
        name: copy.name,
        description: copy.description,
        defaultView: copy.defaultView,
        category: copy.category,
        emoji: copy.emoji,
        kanbanOrder: copy.kanbanOrder || undefined,
        gridOrder: copy.gridOrder || undefined,
        createdBy: { connect: { id: userId } },
        space: { connect: { id: spaceId } },
        shareItems: copy.shareItems,
        keepAuthorAnonymous: copy.keepAuthorAnonymous,
        showCompleted: copy.showCompleted,
        originalCollectionTemplate: { connect: { id: copy.id } },
        keepProfileAnonymous: copy.keepProfileAnonymous,
        labels: { create: labels },
        entities: !copy.shareItems
          ? undefined
          : {
              createMany: {
                data: copy.entities.map((entity) => ({
                  ...entity,
                  spaceId,
                  collectionId,
                  shortId: generateRandomString(10),
                  labelId: entity.labelId
                    ? labelMap.get(entity.labelId)
                    : undefined,
                  recurrenceRule: entity.recurrenceRule || undefined,
                  attachments: entity.attachments || undefined,
                  integrationId: undefined,
                  location: entity.location || undefined,
                  integrationParams: undefined,
                })),
              },
            },
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
      { name: "defaultView", required: false },
      { name: "all", required: false },
      { name: "random", required: false },
    ]);

    if (params.random) {
      const randomRows = await prisma.$queryRaw`
      
      SELECT 
        "id", 
        "name", 
        "defaultView", 
        "public", 
        "emoji", 
        "category", 
        "description"
      FROM "Collection" c
      WHERE c."public" = true
      AND c."userId" = '1fc26e84-9e1d-4e30-89e2-cc958e98481a'
      ORDER BY RANDOM() 
      LIMIT 10;
    `;

      return Response.json(
        (randomRows as any).map((r) => ({
          ...r,
          preview: `https://og.dysperse.com/${r.id}`,
        }))
      );
    }

    const data = await prisma.collection.findMany({
      where: {
        AND: [
          params.id && { id: params.id },
          { public: true },
          params.category && { category: params.category },
          params.defaultView && { defaultView: params.defaultView },
          params.search && {
            OR: [
              { name: { contains: params.search, mode: "insensitive" } },
              { description: { contains: params.search, mode: "insensitive" } },
            ],
          },
        ].filter(Boolean),
      },
      select: {
        id: true,
        name: true,
        defaultView: true,
        public: true,
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
              select: {
                name: true,
                picture: true,
                theme: true,
                lastActive: true,
              },
            },
            id: true,
          },
        },
      },
      take: params.all ? undefined : 50,
      cursor: params.all
        ? undefined
        : params.cursor
        ? { id: params.cursor }
        : undefined,
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
