import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.room.findFirstOrThrow({
      where: {
        AND: [{ propertyId: req.query.property }, { id: req.query.id }],
      },
      include: {
        items: {
          orderBy: { createdAt: "desc" },
        },
        ...(req.query.items === "false" && { items: false }),
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
