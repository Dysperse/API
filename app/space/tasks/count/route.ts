import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionId);

    const startTime = await getApiParam(req, "startTime", true);
    const endTime = await getApiParam(req, "endTime", true);

    const where: Prisma.TaskWhereInput = {
      AND: [
        { recurrenceRule: null },
        // Prevent selecting subtasks
        { parentTasks: { none: { property: { id: spaceId } } } },
        // Make sure that the tasks falls within these dates
        { due: { gte: new Date(startTime) } },
        { due: { lte: new Date(endTime) } },

        { property: { id: spaceId } },
      ],
    };

    const data = await prisma.task.groupBy({
      by: ["due"],
      _count: {
        name: true,
        _all: true,
      },
      orderBy: {
        due: "asc",
      },
      where,
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
