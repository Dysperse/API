import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const item = await prisma.item.delete({
      where: { id: req.query.id },
    });

    res.json(item);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

export default handler;
