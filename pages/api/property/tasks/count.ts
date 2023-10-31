import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";
import { Prisma } from "@prisma/client";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    const where: Prisma.TaskWhereInput = {
      AND: [
        { recurrenceRule: null },
        // Prevent selecting subtasks
        { parentTasks: { none: { property: { id: req.query.property } } } },
        // Make sure that the tasks falls within these dates
        { due: { gte: new Date(req.query.startTime) } },
        { due: { lte: new Date(req.query.endTime) } },

        { property: { id: req.query.property } },
      ],
    };

    const data = await prisma.task.groupBy({
      by: ["due"],
      _count: {
        name: true,
        _all: true,
      },
      orderBy: {
        due: "asc",
      },
      where,
    });

    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
};

export default handler;
