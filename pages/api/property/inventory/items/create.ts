import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.item.create({
      data: {
        name: req.query.name,
        note: req.query.note == "null" ? null : req.query.note,
        room: { connect: { id: req.query.room } },
        property: { connect: { id: req.query.property } },
        createdBy: { connect: { identifier: req.query.userIdentifier } },
      },
      include: {},
    });

    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
};
export default handler;
