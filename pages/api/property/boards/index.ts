import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    //  List all boards with columns, but not items
    const data = await prisma.board.findMany({
      where: {
        AND: [
          req.query.id && { id: req.query.id },
          {
            OR: [
              {
                shareTokens: {
                  some: {
                    user: { identifier: req.query.userIdentifier },
                  },
                },
              },
              {
                public: true,
                AND: { property: { id: req.query.property } },
              },
              {
                AND: [
                  { public: false },
                  { userId: req.query.userIdentifier },
                  { property: { id: req.query.property } },
                ],
              },
            ],
          },
        ],
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
            tasks: {
              select: {
                color: true,
              },
            },
          },
        },
        integrations: { select: { name: true } },
      },
      orderBy: { pinned: "desc" },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
