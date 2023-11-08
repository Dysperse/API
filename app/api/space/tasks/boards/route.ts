import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);
    const id = await getApiParam(req, "id", true);

    const pinned = await getApiParam(req, "pinned", false);
    const name = await getApiParam(req, "name", false);
    const description = await getApiParam(req, "description", false);
    const wallpaper = await getApiParam(req, "wallpaper", false);
    const _public = await getApiParam(req, "public", false);
    const archived = await getApiParam(req, "archived", false);

    if (pinned) {
      await prisma.board.updateMany({
        data: {
          pinned: false,
        },
        where: {
          propertyId: spaceId,
        },
      });
    }

    const data = await prisma.board.updateMany({
      where: {
        AND: [
          { id },
          {
            OR: [
              { propertyId: spaceId },
              { user: { identifier: userIdentifier } },
            ],
          },
        ],
      },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(wallpaper && { wallpaper }),
        ...(_public && {
          public: _public === "true",
        }),
        ...(pinned && {
          pinned: pinned === "true",
        }),
        ...(archived && {
          archived: archived === "true",
        }),
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);
    const _board = await getApiParam(req, "board", true);

    const board = JSON.parse(_board);

    const data = await prisma.board.create({
      data: {
        name: board.name,
        user: {
          connect: { identifier: userIdentifier },
        },
        columns: {
          createMany: {
            data: board.columns.map((column) => ({
              name: column.name,
              emoji: column.emoji,
              order: column.order,
            })),
          },
        },
        property: { connect: { id: spaceId } },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const id = await getApiParam(req, "id", true);

    await prisma.board.deleteMany({
      where: {
        AND: [{ id }, { property: { id: spaceId } }],
      },
    });

    await prisma.integration.deleteMany({
      where: {
        AND: [{ board: { propertyId: spaceId } }, { boardId: id }],
      },
    });
    return Response.json({ success: true });
  } catch (e) {
    handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const id = await getApiParam(req, "id", false);
  const allTasks = await getApiParam(req, "allTasks", false);
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
                        completionInstances: {
                          none: { completedAt: { not: null } },
                        },
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
