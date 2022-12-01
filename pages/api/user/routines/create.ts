import { prisma } from "../../../../lib/prismaClient";

export default async function (req, res) {
  const data = await prisma.routineItem.create({
    data: {
      name: req.query.name,
      stepName: req.query.stepName,
      category: req.query.category,
      durationDays: parseInt(req.query.durationDays),
      time: req.query.time,
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
