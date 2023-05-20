import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routine.create({
    data: {
      name: req.query.name,
      note: req.query.note || "",
      daysOfWeek: req.query.daysOfWeek,
      emoji: req.query.emoji,
      timeOfDay: parseInt(req.query.timeOfDay),
      user: { connect: { identifier: req.query.userIdentifier } },
    },
  });
  res.json(data);
}
