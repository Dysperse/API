import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const OPTIONS = async (request: NextRequest) => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

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
        task: { spaceId },
      },
      select: {
        completedAt: true,
        task: {
          select: {
            label: {
              select: { name: true, id: true, color: true, emoji: true },
            },
          },
        },
      },
    });

    // group by label id
    const byLabel = instances
      .filter((e) => e.task.label)
      .reduce((acc, e: any) => {
        if (!acc[e.task.label.id]) {
          acc[e.task.label.id] = {
            label: e.task.label,
            count: 0,
          };
        }
        acc[e.task.label.id].count++;
        return acc;
      }, {});

    const byHour = instances
      .filter((e) => e.completedAt)
      .reduce(
        (acc, e: any) => {
          const hour = new Date(e.completedAt).getHours();
          if (!acc[hour]) {
            acc[hour] = 0;
          }
          acc[hour]++;
          return acc;
        },
        Array.from({ length: 24 }, () => 0)
      );

    const byDay = instances
      .filter((e) => e.completedAt)
      .reduce(
        (acc, e: any) => {
          const wday = new Date(e.completedAt).getDay();
          if (!acc[wday]) {
            acc[wday] = 0;
          }
          acc[wday]++;
          return acc;
        },
        Array.from({ length: 7 }, () => 0)
      );

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
      byHour,
      byDay,
      byLabel: Object.values(byLabel).sort(
        (a: any, b: any) => b.count - a.count
      ),
      ...data,
      ...user,
      completionInstances: instances,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
