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
    const sessionId = getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionId);
    const _query = getApiParam(req, "query", true);
    const query = JSON.parse(_query)
      .map((i) => {
        if (typeof i === "string") {
          return {
            name: i,
          };
        } else {
          return i.condition;
        }
      })
      .reduce((acc, obj) => {
        for (const key in obj) {
          acc[key] = obj[key];
        }
        return acc;
      }, {});

    console.log(query);

    const results = await prisma.task.findMany({
      where: {
        AND: [
          query.pinned && { pinned: true },
          query.description && { description: { not: null } },
          query.color && { color: { not: null } },
          query.recurrenceRule && { recurrenceRule: { not: null } },
          query.image && { image: { not: null } },
          query.location && { location: { not: null } },
          query.name && { name: { contains: query.name, mode: "insensitive" } },
          // PERMISSIONS ----------------------
          // Prevent selecting subtasks
          { parentTasks: { none: { property: { id: spaceId } } } },
          // Make sure that the task is in the property
          { property: { id: spaceId } },
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
        ].filter((e) => e),
      },
      include: {
        completionInstances: true,
        subTasks: { include: { completionInstances: true } },
        parentTasks: true,
        createdBy: {
          select: {
            name: true,
            color: true,
            email: true,
            Profile: {
              select: {
                picture: true,
              },
            },
          },
        },
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

    if (query.completed) {
      return Response.json({
        query,
        data: results.filter((e) => e.completionInstances.length > 0),
      });
    } else if (query.completed === false) {
      return Response.json({
        query,
        data: results.filter((e) => e.completionInstances.length === 0),
      });
    }
    return Response.json({ query, data: results });
  } catch (e) {
    console.log(e);
    return handleApiError(e);
  }
}
