import { prisma } from "@/lib/server/prisma";

const handler = async (req, res) => {
  try {
    const data = await prisma.task.findMany({
      where: {
        AND: [{ createdBy: { email: req.query.email } }, { completed: true }],
      },
      select: { completedAt: true },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
