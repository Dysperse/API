import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";

dayjs.extend(utc);
dayjs.extend(tz);

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
    const data = await prisma.user.findFirstOrThrow({
      where: { id: userId },
    });

    const timezone = "America/New_York" || data.timeZone;

    const startWeek = dayjs().startOf("week").tz(timezone).utc().toDate();
    const todaysDate = dayjs().tz(timezone).utc();

    const tasks = await prisma.completionInstance.findMany({
      where: {
        AND: [
          {
            completedAt: { gte: startWeek },
          },
          { task: { space: { members: { some: { userId } } } } },
        ],
      },
      include: { task: true },
    });

    const dayTasks = tasks.filter((task) =>
      dayjs(task.completedAt).isSame(todaysDate, "day")
    ).length;

    const weekTasks = tasks.length;

    return Response.json({
      user: data,
      dayTasks,
      weekTasks,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
