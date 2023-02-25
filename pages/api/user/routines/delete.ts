import { prisma } from "../../../../lib/prismaClient";

export default async function handler(req, res) {
  const data = await prisma.routineItem.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
}
