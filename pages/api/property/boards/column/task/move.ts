import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.task.update({
      data: {
        columnId: req.query.columnId,
      },
      where: {
        id: req.query.id,
      },
    });

    res.json({
      data,
      success: true,
    });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
