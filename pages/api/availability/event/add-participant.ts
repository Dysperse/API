import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  try {
    const data = await prisma.eventParticipant.create({
      data: {
        event: { connect: { id: req.query.eventId } },
        ...(req.query.isAuthenticated === "true"
          ? { user: { connect: { email: req.query.email } } }
          : { userData: JSON.parse(req.query.userData) }),
        availability: [],
      },
    });

    return Response.json(data);
  } catch (e) {
    res.status(500).json({ error: true, message: e.message });
  }
}
