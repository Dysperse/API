import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";
dayjs.extend(utc);

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

// Today's tasks
export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "dayStart", required: true },
      { name: "weekStart", required: true },
    ]);
    const data = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    const tasks = await prisma.completionInstance.findMany({
      where: {
        completedAt: {
          gte: dayjs(params.weekStart).utc().toDate(),
        },
      },
    });
    return Response.json({
      user: data,
      dayTasks: tasks.filter((task) => {
        return dayjs(task.completedAt).isSame(dayjs(params.dayStart), "day");
      }).length,
      weekTasks: tasks.length,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
