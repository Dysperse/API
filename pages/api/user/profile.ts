import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.user.findFirstOrThrow({
    where: {
      email: req.query.email,
    },
    select: {
      CoachData: true,
      timeZone: true,
      trophies: true,
      color: true,
      name: true,
      email: true,
    },
  });
  res.json(data);
}
