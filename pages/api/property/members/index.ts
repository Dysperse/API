import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    validateParams(req.query, ["propertyId"]);
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.propertyInvite.findMany({
      where: {
        propertyId: req.query.propertyId,
      },
      select: {
        id: true,
        permission: true,
        user: {
          select: {
            name: true,
            email: true,
            Profile: { select: { picture: true } },
          },
        },
      },
    });
    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};
export default handler;
