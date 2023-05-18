import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  validateParams(req.query, ["id"]);

  const data = await prisma.routineItem.updateMany({
    where: {
      AND: [{ userId: req.query.userIdentifier }, { id: req.query.id }],
    },
    data: {
      routineId: req.query.routineId === "-1" ? null : req.query.routineId,
    },
  });

  res.json(data);
}
