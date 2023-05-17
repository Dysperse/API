import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    await prisma.task.deleteMany({
      where: {
        AND: [
          { propertyId: req.query.property || "-1" },
          { parentTasks: { some: { id: req.query.id || "-1" } } },
        ],
      },
    });

    const data = await prisma.task.delete({
      where: { id: req.query.id },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
