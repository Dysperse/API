import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validateParams(req.query, ["id"]);
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    await prisma.column.deleteMany({
      where: {
        AND: [
          { board: { propertyId: req.query.property } },
          { boardId: req.query.id },
        ],
      },
    });

    await prisma.integration.deleteMany({
      where: {
        AND: [
          { board: { propertyId: req.query.property } },
          { boardId: req.query.id },
        ],
      },
    });

    const data = await prisma.board.delete({
      where: {
        id: req.query.id,
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
