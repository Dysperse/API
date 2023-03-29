import { prisma } from "../../../../lib/server/prisma";

export default async function handler(req, res) {
  const routine = req.query;

  const data = await prisma.routine.create({
    data: {
      name: routine.name,
      note: "",
      daysOfWeek: routine.daysOfWeek,
      emoji: routine.emoji,
      timeOfDay: parseInt(routine.timeOfDay),
      items: {
        createMany: {
          data: JSON.parse(routine.items).map((item) => {
            return {
              name: item.name,
              stepName: item.stepName,
              category: item.category,
              durationDays: item.durationDays,
              time: item.time,
              emoji: "1f31f",
              userId: req.query.userIdentifier,
            };
          }),
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
