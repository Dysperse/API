import { prisma } from "@/lib/server/prisma";

const handler = async (req, res) => {
  try {
    const data = await prisma.propertyLinkInvite.findUnique({
      where: {
        token: req.query.token,
      },
      select: {
        property: true,
      },
    });

    res.json(data ? data : { error: "Invalid token" });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
