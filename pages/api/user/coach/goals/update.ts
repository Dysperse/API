import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  validateParams(req.query, ["id"]);
  const data = await prisma.routineItem.updateMany({
    data: {
      timeOfDay: parseInt(req.query.timeOfDay),
    },
    where: {
      AND: [{ id: req.query.id }, { userId: req.query.userIdentifier }],
    },
  });
  res.json(data);
}
