import { prisma } from "../../../../lib/prismaClient";

export default async function handler(req: any, res: any) {
  const data = await prisma.routineItem.update({
    data: {
      progress: parseInt(req.query.progress),
      lastCompleted: req.query.date,
    },
    where: {
      id: parseInt(req.query.id),
    },
  });
  res.json(data);
}
