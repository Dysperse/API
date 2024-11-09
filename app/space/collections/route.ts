import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
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
    const data = await prisma.collection.findMany({
      where: { userId },
      include: {
        _count: true,
        createdBy: {
          select: {
            email: true,
            username: true,
            profile: { select: { name: true, picture: true } },
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();

    const params = await getApiParams(
      req,
      [
        { name: "name", required: true },
        { name: "emoji", required: true },
        { name: "description", required: false },
        { name: "labels", required: true },
      ],
      { type: "BODY" }
    );
    const data = await prisma.collection.create({
      data: {
        name: params.name,
        description: params.description,
        emoji: params.emoji,
        gridOrder: params.labels,
        space: {
          connect: { id: spaceId },
        },
        createdBy: {
          connect: { id: userId },
        },
      },
    });

    await prisma.$transaction(
      params.labels.map((label) => {
        return prisma.label.update({
          where: { id: label },
          data: { collections: { connect: { id: data.id } } },
        });
      })
    );

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    await prisma.tab.deleteMany({
      where: { collectionId: params.id as string },
    });

    await prisma.collection.delete({
      where: { id: params.id as string },
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();

    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "name", required: false },
        { name: "emoji", required: false },
        { name: "locked", required: false },
        { name: "category", required: false },
        { name: "description", required: false },
        { name: "labels", required: false },
        { name: "showCompleted", required: false },
        { name: "gridOrder", required: false },
        { name: "listOrder", required: false },
        { name: "pinCode", required: false },
        { name: "pinAuthorizationExpiresAt", required: false },
        { name: "keepProfileAnonymous", required: false },
        { name: "public", required: false },
        { name: "defaultView", required: false },
        { name: "kanbanOrder", required: false },
      ],
      { type: "BODY" }
    );

    if (
      params.name ||
      params.emoji ||
      params.description ||
      params.kanbanOrder ||
      params.listOrder ||
      params.pinCode ||
      params.defaultView ||
      params.pinAuthorizationExpiresAt ||
      params.gridOrder ||
      params.category ||
      typeof params.public === "boolean" ||
      typeof params.showCompleted === "boolean" ||
      typeof params.keepProfileAnonymous === "boolean" ||
      typeof params.locked === "boolean"
    ) {
      await prisma.collection.update({
        where: { id: params.id as string },
        data: {
          name: params.name || undefined,
          description: params.description || undefined,
          locked: params.locked || undefined,
          defaultView: params.defaultView || undefined,
          emoji: params.emoji || undefined,
          gridOrder: params.gridOrder || undefined,
          category: params.category || undefined,
          keepProfileAnonymous: params.keepProfileAnonymous || undefined,
          kanbanOrder: params.kanbanOrder || undefined,
          pinAuthorizationExpiresAt: params.pinAuthorizationExpiresAt
            ? dayjs().subtract(1, "year").toISOString()
            : undefined,
          listOrder: params.listOrder || undefined,
          pinCode:
            typeof params.pinCode === "number"
              ? params.pinCode
              : params.pinCode === false
              ? null
              : undefined,
          public:
            typeof params.public === "boolean" ? params.public : undefined,
          showCompleted:
            typeof params.showCompleted === "boolean"
              ? params.showCompleted
              : undefined,
          space: {
            connect: { id: spaceId },
          },
        },
      });
    }

    if (params.labels) {
      const labels = await prisma.label.findMany({
        where: { userId },
      });
      // If the label is not in the new list, remove it, otherwise add it
      await prisma.$transaction(
        labels.map((label) => {
          return prisma.label.update({
            where: { id: label.id },
            data: {
              collections: {
                [params.labels.includes(label.id) ? "connect" : "disconnect"]: {
                  id: params.id as string,
                },
              },
            },
          });
        })
      );
    }

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
