import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    const data = await prisma.event.findFirstOrThrow({
      where: { id: req.query.id },
      include: {
        ...(!req.query.basic && {
          participants: {
            select: {
              id: true,
              availability: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  Profile: { select: { picture: true } },
                },
              },
            },
          },
        }),
      },
    });
    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: true, message: e.message });
  }
}
