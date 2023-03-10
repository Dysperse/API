import { prisma } from "../../../../lib/prismaClient";

// Checks if the user has already done today's daily check-in
export default async function handler(req, res) {
  const data = await prisma.dailyCheckIn.findMany({
    where: {
      AND: [
        { date: new Date(req.query.date) },
        {
          userId: req.query.userIdentifier,
        },
      ],
    },
  });
  console.log(data);
  res.json(data);
}
