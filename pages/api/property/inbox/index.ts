import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });
    const data = await prisma.inboxItem.findMany({
      where: {
        property: {
          id: req.query.property,
        },
      },
      orderBy: {
        id: "desc",
      },
    });

    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};
export default handler;
