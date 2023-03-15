import { prisma } from "../../../../../lib/prismaClient";

export default async function handler(req, res) {
  const data = await prisma.routine.create({
    data: {
      name: req.query.name,
      note: req.query.note,
      daysOfWeek: req.query.daysOfWeek,
      emoji: req.query.emoji,
      timeOfDay: req.query.timeOfDay,
      user: { connect: { identifier: req.query.userIdentifier } },
    },
  });
  res.json(data);
}
