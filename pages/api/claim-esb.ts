import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    const user = await prisma.user.findUniqueOrThrow({
      where: {
        identifier: req.query.userIdentifier || "-1",
      },
    });
    const id = user?.id;
    const data = await prisma.profile.upsert({
      where: {
        id,
      },
      update: {
        badges: {
          push: "Early supporter",
        },
      },
      create: {
        user: {
          connect: { id },
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
