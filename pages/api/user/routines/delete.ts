import { prisma } from "../../../../lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routineItem.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
}
