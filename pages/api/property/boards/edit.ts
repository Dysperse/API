import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

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

    const data = await prisma.board.update({
      where: { id: req.query.id },
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
