import { prisma } from "../../../../lib/prismaClient";

// Checks if the user has already done today's daily check-in
export default async function handler(req, res) {
  if (req.query.delete === "true") {
    await prisma.dailyCheckIn.deleteMany({
      where: {
        date: new Date(req.query.date),
      },
    });
    res.json({ success: true });
  } else {
    const exists = await prisma.dailyCheckIn.findMany({
      where: {
        AND: [
          {
            date: new Date(req.query.date),
          },
          {
            userId: req.query.userIdentifier,
          },
        ],
      },
      take: 1,
    });
    if (exists.length === 1) {
      const data = await prisma.dailyCheckIn.updateMany({
        where: {
          AND: [
            {
              userId: req.query.userIdentifier,
            },
            {
              date: new Date(req.query.date),
            },
          ],
        },
        data: {
          mood: req.query.mood,
          reason: req.query.reason,
        },
      });
      res.json(data);
    } else {
      const data = await prisma.dailyCheckIn.create({
        data: {
          date: new Date(req.query.date),
          mood: req.query.mood,
          reason: req.query.reason,
          user: {
            connect: {
              identifier: req.query.userIdentifier,
            },
          },
        },
      });
      console.log(data);
      res.json(data);
    }
  }
}
