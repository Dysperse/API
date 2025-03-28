import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { nonReadOnlyPermissionArgs } from "../route";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();

    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "date", required: true },
        { name: "iteration", required: false },
      ],
      {
        type: "BODY",
      }
    );

    await prisma.entity.findFirstOrThrow({
      where: nonReadOnlyPermissionArgs(userId, params, spaceId),
      select: { id: true },
    });

    const instance = await prisma.completionInstance.create({
      data: {
        task: { connect: { id: params.id } },
        completedAt: new Date(params.date),
        iteration: params.iteration,
      },
    });

    await incrementUserInsight(userId, "tasksCompleted");

    return Response.json({ instance });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();

    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "iteration", required: false },
      ],
      {
        type: "BODY",
      }
    );

    await prisma.entity.findFirstOrThrow({
      where: nonReadOnlyPermissionArgs(userId, params, spaceId),
      select: { id: true },
    });

    const instance = await prisma.completionInstance.deleteMany({
      where: params.iteration
        ? {
            AND: [{ iteration: params.iteration }, { task: { id: params.id } }],
          }
        : {
            task: { id: params.id },
          },
    });

    return Response.json({ instance });
  } catch (e) {
    return handleApiError(e);
  }
}
