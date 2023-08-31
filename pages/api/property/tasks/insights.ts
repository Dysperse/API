import { prisma } from "@/lib/server/prisma";

const handler = async (req, res) => {
  try {
    const data = await prisma.task.findMany({
      where: {
        createdBy: { email: req.query.email },
      },
      select: { completedAt: true },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
