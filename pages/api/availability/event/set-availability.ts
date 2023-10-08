import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    let user: any = {};
    if (req.query.email) {
      user = await prisma.eventParticipant.findFirst({
        where: {
          AND: [
            { user: { email: req.query.email } },
            { event: { id: req.query.eventId } },
          ],
        },
      });
    } else {
      const users = await prisma.eventParticipant.findMany({
        where: { event: { id: req.query.eventId } },
      });

      user = users.find(
        (u: any) => u.userData?.email === JSON.parse(req.query.userData).email
      );
    }

    if (user?.id) {
      const d = await prisma.eventParticipant.update({
        where: {
          id: user?.id,
        },
        data: {
          userData: req.query.userData
            ? JSON.parse(req.query.userData)
            : undefined,
          availability: JSON.parse(req.query.availability),
        },
      });
      res.json(d);
    } else {
      const d = await prisma.eventParticipant.create({
        data: {
          availability: JSON.parse(req.query.availability),
          ...(req.query.email
            ? {
                user: { connect: { email: req.query.email } },
              }
            : { userData: JSON.parse(req.query.userData) }),
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
    res.status(400).json({ error: true, message: e.message });
  }
}
