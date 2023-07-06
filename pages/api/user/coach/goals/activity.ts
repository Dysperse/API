import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routineActivityData.findMany({
    where: {
      AND: [{ id: req.query.id }],
    },
  });
  res.json(data);
}
