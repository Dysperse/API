import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    res.setHeader(
      "Cache-Control",
      "public, s-maxage=10, stale-while-revalidate=59"
    );
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    //  List all boards with columns, but not items
    const user = await prisma.property.findFirstOrThrow({
      where: {
        id: req.query.property,
      },
      select: {
        _count: true,
      },
    });

    res.json(user);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
