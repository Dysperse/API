import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const orderObj = JSON.parse(req.query.order);

    orderObj.forEach(async (column) => {
      await prisma.column.update({
        where: { id: column.id },
        data: {
          order: column.order,
        },
      });
    });

    res.json({ success: true });
  } catch (e) {
    res.json({ error: e.message });
  }
};

export default handler;
