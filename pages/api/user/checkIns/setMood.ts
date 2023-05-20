import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

// Checks if the user has already done today's daily check-in
export default async function handler(req, res) {
  if (req.query.delete === "true") {
    validateParams(req.query, ["date"]);
    await prisma.dailyCheckIn.deleteMany({
      where: { date: new Date(req.query.date) },
    });
    res.json({ success: true });
  } else {
    const exists = await prisma.dailyCheckIn.findMany({
      where: {
        AND: [
          { date: new Date(req.query.date) },
          { userId: req.query.userIdentifier },
        ],
      },
      take: 1,
    });

    const template = {
      mood: req.query.mood,
      date: new Date(req.query.date),
      ...(req.query.reason && { reason: req.query.reason }),
      ...(req.query.stress && { stress: parseInt(req.query.stress) }),
      ...(req.query.rest && { rest: parseInt(req.query.rest) }),
      ...(req.query.pain && { pain: parseInt(req.query.pain) }),
      ...(req.query.food && { food: parseInt(req.query.food) }),
    };

    if (exists.length === 1) {
      const data = await prisma.dailyCheckIn.updateMany({
        where: {
          AND: [
            { userId: req.query.userIdentifier },
            { date: new Date(req.query.date) },
          ],
        },
        data: { ...template },
      });
      res.json(data);
    } else {
      const data = await prisma.dailyCheckIn.create({
        data: {
          ...template,
          user: { connect: { identifier: req.query.userIdentifier } },
        },
      });
      res.json(data);
    }
  }
}
