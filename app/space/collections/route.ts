import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
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
    const { userId, spaceId } = await getIdentifiers(req);

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
