import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.integration.findMany({
      where: { property: { id: req.query.property } },
      include: { board: { select: { name: true, id: true } } },
    });

    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};
export default handler;
