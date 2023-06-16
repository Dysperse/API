import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    const data = await prisma.profile.upsert({
      where: {
        userId: req.query.userIdentifier || "-1",
      },
      update: {
        badges: {
          push: "Early supporter",
        },
      },
      create: {
        user: {
          connect: { identifier: req.query.userIdentifier || "-1" },
        },
        badges: ["Early supporter"],
      },
    });
    console.log(data);
    res.json(data);
  } catch ({ message: error }: any) {
    res.status(401).json({ error });
  }
}
