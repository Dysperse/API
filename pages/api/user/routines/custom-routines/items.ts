import { prisma } from "../../../../../lib/prismaClient";

export default async function handler(req, res) {
  const data = await prisma.routine.findMany({
    where: {
      userId: req.query.userIdentifier,
    },
    include: {
      items: true,
    },
  });
  res.json(data);
}
