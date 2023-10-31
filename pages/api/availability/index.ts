import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["userIdentifier"]);

    const data = await prisma.event.findMany({
      where: {
        user: { identifier: req.query.userIdentifier },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                color: true,
                Profile: {
                  select: {
                    picture: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json(data);
  } catch (e) {
    res.status(400).json({ error: true, message: e.message });
  }
}
