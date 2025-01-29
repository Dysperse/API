import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { prisma } from "@/lib/prisma";
import { LexoRank } from "lexorank";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const tabs = await prisma.tab.findMany({
      where: {
        userId,
      },
      orderBy: { order: "asc" },
      include: {
        label: {
          select: { name: true, emoji: true },
        },
        collection: {
          select: { name: true, emoji: true },
          where: {
            OR: [{ public: true }, { AND: [{ public: false }, { userId }] }],
          },
        },
      },
    });
    return Response.json(tabs);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "slug", required: true },
        { name: "params", required: false },
      ],
      { type: "BODY" }
    );
    if (params.params && typeof params.params !== "object") {
      throw new Error("Params must be an object or undefined");
    }

    const { userId } = await getIdentifiers();

    const lastTab = await prisma.tab.findFirst({
      where: { userId },
      orderBy: { order: "desc" },
      select: { order: true },
    });

    const tab = await prisma.tab.create({
      data: {
        slug: params.slug,
        params: params.params,
        userId,
        order: lastTab?.order
          ? LexoRank.parse(lastTab?.order).genNext().toString()
          : LexoRank.middle().toString(),
        ...(params.slug.includes("/collections/") &&
          params.params.id !== "all" && {
            collectionId: params.params.id,
          }),
        ...(params.slug.includes("/labels/") &&
          params.params.id !== "all" && {
            labelId: params.params.id,
          }),
      },
      include: {
        collection: {
          select: { name: true, emoji: true },
          where: {
            OR: [{ public: true }, { AND: [{ public: false }, { userId }] }],
          },
        },
      },
    });

    await incrementUserInsight(userId, "tabsCreated");

    if (tab.collectionId)
      await prisma.collectionAccess.updateMany({
        where: {
          AND: [
            { collectionId: tab.collectionId },
            { userId },
            { hasSeen: false },
          ],
        },
        data: {
          hasSeen: true,
        },
      });

    return Response.json(tab);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "id", required: true }], {
      type: "QUERY",
    });

    const { userId } = await getIdentifiers();

    const tab = await prisma.tab.deleteMany({
      where: {
        AND: [{ id: params.id }, { userId }],
      },
    });
    return Response.json(tab);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "order", required: false },
        { name: "params", required: false },
        { name: "slug", required: false },
      ],
      {
        type: "BODY",
      }
    );

    const { userId } = await getIdentifiers();

    const tab = await prisma.tab.update({
      where: {
        id: params.id,
        userId,
      },
      data: {
        order: params.order ? params.order : undefined,
        params: params.params ? params.params : undefined,
        slug: params.slug ? params.slug : undefined,
      },
      select: {
        slug: true,
      },
    });

    if (tab.slug.includes("collections") && params.params?.type) {
      const year = new Date().getFullYear();
      const userInsight = await prisma.userInsight.findUnique({
        where: { userId_year: { userId, year } },
        select: { viewCount: true },
      });

      await prisma.userInsight.upsert({
        where: {
          userId_year: { userId: userId, year },
        },
        create: { year, userId, viewCount: { [params.params.type]: 1 } },
        update: {
          viewCount: {
            // @ts-ignore
            ...userInsight.viewCount,
            // @ts-ignore
            [params.params.type]: userInsight.viewCount[params.params.type] + 1,
          },
        },
      });
    }

    return Response.json(tab);
  } catch (e) {
    return handleApiError(e);
  }
}
