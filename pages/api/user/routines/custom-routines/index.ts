import { prisma } from "../../../../../lib/prismaClient";

export default async function handler(req, res) {
  const data = await prisma.routine.findMany({
    where: {
      userId: req.query.userIdentifier,
    },
    include: {
      items: {
        select: {
          lastCompleted: true,
          durationDays: true,
          progress: true,
        },
      },
    },
  });
  res.json(data);
}
