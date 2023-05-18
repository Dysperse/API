import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    validateParams(req.query, ["property"]);

    const data = await prisma.item.deleteMany({
      where: {
        AND: [{ trash: true }, { propertyId: req.query.property }],
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
