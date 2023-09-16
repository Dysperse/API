import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["userIdentifier"]);

    const user = await prisma.eventParticipant.findFirst({
      where: {
        AND: [
          { user: { email: req.query.email } },
          { event: { id: req.query.eventId } },
        ],
      },
    });

    if (user?.id) {
      const d = await prisma.eventParticipant.update({
        where: {
          id: user?.id,
        },
        data: {
          availability: JSON.parse(req.query.availability),
        },
      });
      res.json(d);
    } else {
      const d = await prisma.eventParticipant.create({
        data: {
          availability: JSON.parse(req.query.availability),
          user: {
            connect: {
              email: req.query.email,
            },
          },
          event: {
            connect: {
              id: req.query.eventId,
            },
          },
        },
      });
      res.json(d);
    }
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: true, message: e.message });
  }
}
