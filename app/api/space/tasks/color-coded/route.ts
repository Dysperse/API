import {
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionId);

    const data = await prisma.task.findMany({
      where: {
        AND: [
          { completed: false },
          {
            NOT: {
              color: "grey",
            },
          },
          {
            property: {
              id: spaceId,
            },
          },
          // If it's private, match up the task's user id with the provided identifier.
          // If it's public, just *select it* bruh
          {
            OR: [
              {
                column: null,
              },
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
      include: {
        subTasks: true,
        parentTasks: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
