import { prisma } from "../../../../lib/prismaClient";

export default async function handler(req: any, res: any) {
  const data = await prisma.routineItem.update({
    data: {
      progress: req.query.progress,
      lastCompleted: req.query.date,
    },
    where: {
      id: req.query.id,
    },
  });
  res.json(data);
}
