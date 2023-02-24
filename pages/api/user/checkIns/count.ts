import { prisma } from "../../../../lib/prismaClient";

// Checks if the user has already done today's daily check-in
export default async function handler(req, res) {
  const data = await prisma.dailyCheckIn.findMany({
    where: {
      userId: req.query.userIdentifier,
    },
    select: {
      mood: true,
    },
  });
  res.json(data);
}
