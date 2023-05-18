import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  validateParams(req.query, ["id", "userIdentifier"]);

  const data = await prisma.routine.deleteMany({
    where: {
      AND: [{ userId: req.query.userIdentifier }, { id: req.query.id }],
    },
  });
  res.json(data);
}
