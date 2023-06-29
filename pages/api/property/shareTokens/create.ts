import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import dayjs from "dayjs";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    const data = await prisma.shareToken.create({
      data: {
        expiresAt: dayjs(req.query.date).add(req.query.expires, "day").toDate(),
        property: { connect: { id: req.query.property } },
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
