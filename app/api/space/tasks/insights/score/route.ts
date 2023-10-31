import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = getApiParam(req, "email", true);
    const data = await prisma.completionInstance.findMany({
      where: {
        task: {
          AND: [
            { createdBy: { email } },
            { due: { not: null } },
            { recurrenceRule: null },
          ],
        },
      },
      select: {
        completedAt: true,
        task: {
          select: {
            _count: true,
            due: true,
            pinned: true,
          },
        },
      },
    });

    // max points user can have
    let score = data.length;

    for (const instance of data) {
      const { completedAt } = instance;
      const { due, pinned } = instance.task;

      const late = dayjs(completedAt).isAfter(due);

      if (late) score -= pinned ? 0.9 : 0.5;
    }
    return Response.json({ percentage: (score / data.length) * 100, score });
  } catch (e: any) {
    return handleApiError(e);
  }
}
