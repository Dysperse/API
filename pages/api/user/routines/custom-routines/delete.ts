import { prisma } from "../../../../../lib/prismaClient";

export default async function handler(req, res) {
  const data = await prisma.routine.deleteMany({
    where: {
      AND: [{ userId: req.query.userIdentifier }, { id: req.query.id }],
    },
  });
  res.json(data);
}
