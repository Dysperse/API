import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routineItem.create({
    data: {
      name: req.query.name,
      stepName: req.query.stepName,
      category: req.query.category,
      timeOfDay: parseInt(req.query.timeOfDay),
      durationDays: parseInt(req.query.durationDays),
      emoji: "",
      user: {
        connect: {
          identifier: req.query.userIdentifier,
        },
      },
    },
  });
  res.json(data);
}
