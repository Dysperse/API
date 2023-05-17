import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.item.deleteMany({
      where: {
        AND: [{ trash: true }, { propertyId: req.query.property || "nothing" }],
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
