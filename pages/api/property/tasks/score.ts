import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import dayjs from "dayjs";

const handler = async (req, res) => {
  try {
    validateParams(req.query, ["email"]);
    const data = await prisma.completionInstance.findMany({
      where: {
        task: {
          AND: [
            { createdBy: { email: req.query.email } },
            { due: { not: null } },
            { recurrenceRule: null },
          ],
        },
      },
      select: {
        completedAt: true,
        task: {
          select: {
            _count: true,
            due: true,
            pinned: true,
          },
        },
      },
    });

    // max points user can have
    let score = data.length;

    for (const instance of data) {
      const { completedAt } = instance;
      const { due, pinned } = instance.task;

      const late = dayjs(completedAt).isAfter(due);

      if (late) score -= pinned ? 0.9 : 0.5;
    }
    res.json({ percentage: (score / data.length) * 100, score });
  } catch (e:any) {
    res.json({ error: e.message });
  }
};

export default handler;
