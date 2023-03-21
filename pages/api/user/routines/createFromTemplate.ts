import { prisma } from "../../../../lib/server/prisma";

export default async function handler(req, res) {
  const routine = req.query.routine;
  const data = await prisma.routine.create({
    data: {
      name: routine.name,
      note: "",
      daysOfWeek: routine.daysOfWeek,
      emoji: routine.emoji,
      timeOfDay: parseInt(routine.timeOfDay),
      items: {
        createMany: {
          data: JSON.parse(routine.items),
        },
      },
      user: {
        connect: {
          identifier: req.query.userIdentifier,
        },
      },
    },
  });
  res.json(data);
}
