import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";
dayjs.extend(utc);
dayjs.extend(isBetween);

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);

    const _start = await getApiParam(req, "start", true);
    const _end = await getApiParam(req, "end", true);

    const start = dayjs(_start);
    const end = dayjs(_end);

    // Retrieve tasks in a single query
    const tasksToday = await prisma.task.findMany({
      where: {
        AND: [
          { parentTasks: { none: { property: { id: spaceId } } } },
          { property: { id: spaceId } },
          { recurrenceRule: null },
          { due: { gte: start.toDate(), lte: end.toDate() } },
          { completionInstances: { none: { taskId: { contains: "-" } } } },
        ],
      },
      orderBy: { due: "asc" },
      include: {
        parentTasks: true,
        subTasks: { include: { completionInstances: { take: 1 } } },
        completionInstances: true,
        column: {
          include: {
            board: { select: { id: true, name: true, public: true } },
          },
        },
        createdBy: {
          select: {
            name: true,
            color: true,
            email: true,
            Profile: {
              select: { picture: true },
            },
          },
        },
      },
    });

    const oldTasks = await prisma.task.findMany({
      where: {
        AND: [
          { parentTasks: { none: { property: { id: spaceId } } } },
          { property: { id: spaceId } },
          { recurrenceRule: null },
          { due: { lte: start.toDate() } },
          { due: { not: null } },
          { completionInstances: { none: { taskId: { contains: "-" } } } },
        ],
      },
      take: 5,
      orderBy: { due: "asc" },
      include: {
        parentTasks: true,
        subTasks: { include: { completionInstances: { take: 1 } } },
        completionInstances: true,
        column: {
          include: {
            board: { select: { id: true, name: true, public: true } },
          },
        },
        createdBy: {
          select: {
            name: true,
            color: true,
            email: true,
            Profile: {
              select: { picture: true },
            },
          },
        },
      },
    });

    return Response.json({
      oldTasks,
      tasksToday,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
