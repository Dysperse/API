import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routineActivityData.findMany({
    where: {
      AND: [
        { routineItemId: req.query.id },
        {
          ...(req.query.date && { date: { gte: new Date(req.query.date) } }),
        },
      ],
    },
  });
  res.json(data);
}
