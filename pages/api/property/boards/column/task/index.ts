import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.task.findUnique({
      where: { id: req.query.id },
      include: {
        parentTasks: true,
        subTasks: true,
        property: { select: { name: true, id: true } },
        column: {
          include: { board: { select: { id: true, name: true, public: true } } },
        },
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
