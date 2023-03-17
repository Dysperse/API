import { prisma } from "../../../../../lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routine.findMany({
    where: {
      AND: [
        {
          userId: req.query.userIdentifier,
        },
        {
          id: req.query.id,
        },
      ],
    },
    take: 1,
    include: {
      items: true,
    },
  });
  res.json(data);
}
