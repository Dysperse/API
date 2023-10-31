import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);
    const view = getApiParam(req, "view", true);
    const time = getApiParam(req, "time", false);

    const data = await prisma.task.findMany({
      where: {
        AND: [
          // Prevent selecting subtasks
          { parentTasks: { none: { property: { id: spaceId } } } },
          // Make sure that the task is in the property
          { property: { id: spaceId } },

          // Backlog
          ...(view === "backlog"
            ? [{ due: { lte: new Date(time) }, completed: false }]
            : []),

          // Upcoming
          ...(view === "upcoming"
            ? [{ due: { gte: new Date(time) }, completed: false }]
            : []),

          // Unscheduled
          ...(view === "unscheduled" ? [{ due: null }] : []),

          {
            OR: [
              { column: null },
              {
                column: {
                  board: {
                    AND: [{ public: false }, { userId: userIdentifier }],
                  },
                },
              },
              {
                column: {
                  board: {
                    AND: [{ public: true }, { propertyId: spaceId }],
                  },
                },
              },
            ],
          },
        ],
      },
      orderBy: {
        completed: "asc",
      },
      include: {
        completionInstances: true,
        subTasks: { include: { completionInstances: true } },
        parentTasks: true,
        column: {
          select: {
            board: {
              select: {
                name: true,
                id: true,
              },
            },
            name: true,
            emoji: true,
          },
        },
      },
    });

    if (view === "completed") {
      return Response.json(
        data.filter((e) => e.completionInstances.length > 0)
      );
    }
    return Response.json(
      data.filter(
        (e) => e.recurrenceRule === null && e.completionInstances.length === 0
      )
    );
  } catch (e) {
    return handleApiError(e);
  }
}
