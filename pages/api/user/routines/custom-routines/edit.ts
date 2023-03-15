import { prisma } from "../../../../../lib/prismaClient";

export default async function handler(req, res) {
  const data = await prisma.routine.update({
    data: {
      name: req.query.name,
      note: req.query.note,
      daysOfWeek: req.query.daysOfWeek,
      emoji: req.query.emoji,
      timeOfDay: parseInt(req.query.timeOfDay),
      user: { connect: { identifier: req.query.userIdentifier } },
    },
    where: {
      id: req.query.id,
    },
  });
  res.json(data);
}
