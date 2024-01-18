import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { LexoRank } from "lexorank";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    const tabs = await prisma.tab.findMany({
      where: {
        userId,
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
        { name: "href", required: true },
        { name: "isCollection", required: false },
      ],
      { type: "BODY" }
    );
    if (params.params && typeof params.params !== "object") {
      throw new Error("Params must be an object or undefined");
    }

    const { userId } = await getIdentifiers(req);
    const tab = await prisma.tab.create({
      data: {
        href: params.href,
        userId,
        order: LexoRank.max().toString(),
        ...(params.isCollection && {
          collection: { connect: { id: params.params.id } },
        }),
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

    const { userId } = await getIdentifiers(req);

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
        { name: "href", required: false },
      ],
      {
        type: "BODY",
      }
    );

    const { userId } = await getIdentifiers(req);

    const tab = await prisma.tab.updateMany({
      where: {
        AND: [{ id: params.id }, { userId }],
      },
      data: {
        order: params.order ? params.order : undefined,
        href: params.href ? params.href : undefined,
      },
    });
    return Response.json(tab);
  } catch (e) {
    return handleApiError(e);
  }
}
