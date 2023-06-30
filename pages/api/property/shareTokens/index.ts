import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });
    const data = await prisma.shareToken.findMany({
      where: {
        board: { id: req.query.board },
      },
      include: {
        user: {
          select: {
            email: true,
            name: true,
            Profile: { select: { picture: true } },
          },
        },
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
