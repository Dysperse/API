import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  let data: any = await prisma.user.findFirstOrThrow({
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
      followers: true,
      following: true,
    },
  });
  res.json(data);
}
