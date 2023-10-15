import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

const handler = async (req, res) => {
  try {
    validateParams(req.query, ["email"]);
    const data = await prisma.completionInstance.findMany({
      where: {
        task: {
          createdBy: {
            email: req.query.email,
          },
        },
      },
      include: {
        task: {
          select: {
            pinned: true,
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
