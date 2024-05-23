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
export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const data = await prisma.collection.findMany({
      where: { userId },
      include: {
        _count: true,
        integration: true,
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
        { name: "description", required: false },
        { name: "labels", required: false },
        { name: "showCompleted", required: false },
        { name: "gridOrder", required: false },
        { name: "kanbanOrder", required: false },
      ],
      { type: "BODY" }
    );

    if (
      params.name ||
      params.emoji ||
      params.description ||
      params.gridOrder ||
      typeof params.showCompleted === "boolean"
    ) {
      await prisma.collection.update({
        where: { id: params.id as string },
        data: {
          name: params.name || undefined,
          description: params.description || undefined,
          emoji: params.emoji || undefined,
          gridOrder: params.gridOrder || undefined,
          kanbanOrder: params.kanbanOrder || undefined,
          showCompleted:
            typeof params.showCompleted === "boolean"
              ? params.showCompleted
              : undefined,
          space: {
            connect: { id: spaceId },
          },
          createdBy: {
            connect: { id: userId },
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
