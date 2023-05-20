import { prisma } from "@/lib/server/prisma";

// Checks if the user has already done today's daily check-in
export default async function handler(req, res) {
  const data = await prisma.dailyCheckIn.findMany({
    where: {
      AND: [
        { userId: req.query.userIdentifier },
        { date: { gte: new Date(req.query.gte) } },
        { date: { lte: new Date(req.query.lte) } },
      ],
    },
    select: {
      mood: true,
      reason: true,
      date: true,
      stress: true,
      food: true,
      pain: true,
      rest: true,
    },
    orderBy: {
      date: "asc",
    },
  });
  res.json(data);
}
