import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    const data = await prisma.shareToken.create({
      data: {
        expiresAt: new Date(req.query.expiresAt),
        readOnly: req.query.readOnly === "true",
        property: { connect: { id: req.query.boardProperty } },
        ...(req.query.board && { board: { connect: { id: req.query.board } } }),
        user: { connect: { email: req.query.email } },
      },
    });
    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
};
export default handler;
