import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    validateParams(req.query, ["property"]);

    if (req.query.pinned) {
      await prisma.board.updateMany({
        data: {
          pinned: false,
        },
        where: {
          propertyId: req.query.property,
        },
      });
    }

    const data = await prisma.board.updateMany({
      where: {
        AND: [{ id: req.query.id }, { propertyId: req.query.property }],
      },
      data: {
        ...(req.query.name && { name: req.query.name }),
        ...(req.query.description && { description: req.query.description }),
        ...(req.query.public && {
          public: req.query.public === "true",
        }),
        ...(req.query.pinned && {
          pinned: req.query.pinned === "true",
        }),
        ...(req.query.archived && {
          archived: req.query.archived === "true",
        }),
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
