import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    //  List all boards with columns, but not items
    const data = await prisma.task.count({
      where: {
        propertyId: req.query.property,
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
