import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["id", "userIdentifier"]);

    const data = await prisma.routine.deleteMany({
      where: {
        AND: [{ userId: req.query.userIdentifier }, { id: req.query.id }],
      },
    });
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
