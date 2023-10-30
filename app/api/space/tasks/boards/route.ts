import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function DELETE(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const id = getApiParam(req, "id", true);
    const { spaceId } = await getIdentifiers(sessionToken);

    await prisma.board.deleteMany({
      where: {
        AND: [{ id }, { property: { id: spaceId } }],
      },
    });
    return Response.json({ success: true });
  } catch (e) {
    handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  const sessionToken = getSessionToken();
  const id = getApiParam(req, "id", false);
  const allTasks = getApiParam(req, "allTasks", false);
  const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);

  try {
    const data = await prisma.board.findMany({
      where: {
        AND: [
          { id: id || undefined },
          {
            OR: [
              {
                shareTokens: { some: { user: { identifier: userIdentifier } } },
              },
              {
                public: true,
                AND: {
                  property: {
                    id: spaceId,
                  },
                },
              },
              {
                AND: [
                  { public: false },
                  { user: { identifier: userIdentifier } },
                ],
              },
            ],
          },
        ].filter((e) => e),
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
