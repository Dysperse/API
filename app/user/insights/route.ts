import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();

    const user = await prisma.profile.findFirstOrThrow({
      where: { userId },
      select: { tasksCreated: true },
    });
    const data = await prisma.space.findFirstOrThrow({
      where: { id: spaceId },
      select: { _count: true },
    });

    const instances = await prisma.completionInstance.findMany({
      where: {
        AND: [{ task: { spaceId } }, { completedAt: { not: null } }],
      },
      select: { completedAt: true },
    });

    const tasksCreated = data._count.entities + user.tasksCreated;

    const treesSaved =
      // Each tree produces 20000 sticky notes
      tasksCreated / 70000 +
      // Each 25x30 inch paper is 0.09 trees
      data._count.collections * 0.09 +
      // Each label is 8000 binder dividers
      data._count.labels / 8000;

    //   A wide ruled notebook is 28 lines of paper, and each line is 4.74g of CO2
    const co2 = 4.74 * (tasksCreated / 28);

    return Response.json({
      co2,
      treesSaved,
      ...data,
      ...user,
      completionInstances: instances,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
