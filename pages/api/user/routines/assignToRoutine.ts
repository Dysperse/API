import { prisma } from "../../../../lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.routineItem.updateMany({
    where: {
      AND: [{ userId: req.query.userIdentifier }, { id: req.query.id }],
    },
    data: {
      routineId: req.query.routineId == "-1" ? null : req.query.routineId,
    },
  });
  console.log(data);
  res.json(data);
}
