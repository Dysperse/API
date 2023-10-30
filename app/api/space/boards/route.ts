import {
  getApiParam,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const sessionToken = getSessionToken();
  const id = getApiParam(req, "id", false);
  const allTasks = getApiParam(req, "allTasks", false);

  try {
    const data = await prisma.board.findMany({
      where: {
        AND: [
          {
            user: {
              properties: { some: { permission: { not: "read-only" } } },
            },
          },
          // id && { id },
          {
            OR: [
              {
                shareTokens: {
                  some: {
                    user: { sessions: { some: { id: sessionToken } } },
                  },
                },
              },
              {
                public: true,
                AND: {
                  property: {
                    members: {
                      some: {
                        user: { sessions: { some: { id: sessionToken } } },
                      },
                    },
                  },
                },
              },
              // {
              //   AND: [{ public: false }],
              // },
            ],
          },
        ],
        // .filter((e) => e),
      },
      include: {
        user: { select: { email: true } },
        shareTokens: {
          select: {
            createdAt: true,
            expiresAt: true,
            readOnly: true,
            user: {
              select: {
                name: true,
                color: true,
                email: true,
                Profile: { select: { picture: true } },
              },
            },
          },
        },
        property: {
          select: {
            id: true,
            type: true,
            name: true,
            members: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    Profile: { select: { picture: true } },
                  },
                },
              },
            },
          },
        },
        columns: {
          orderBy: { order: "asc" },
          include: {
            _count: allTasks
              ? true
              : {
                  select: {
                    tasks: {
                      where: {
                        completed: false,
                      },
                    },
                  },
                },
          },
        },
        integrations: { select: { name: true, lastSynced: true } },
      },
      orderBy: { pinned: "desc" },
    });
    return Response.json(data);
  } catch (e) {
    handleApiError(e);
  }
}
