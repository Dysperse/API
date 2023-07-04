import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    const board = JSON.parse(req.query.board);

    const data = await prisma.board.create({
      data: {
        name: board.name,
        user: {
          connect: { identifier: req.query.userIdentifier },
        },
        columns: {
          createMany: {
            data: board.columns.map((column) => ({
              name: column.name,
              emoji: column.emoji,
            })),
          },
        },
        property: {
          connect: {
            id: req.query.property,
          },
        },
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
