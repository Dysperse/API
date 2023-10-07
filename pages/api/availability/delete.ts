import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["userIdentifier"]);

    const { id } = await prisma.event.findFirstOrThrow({
      where: {
        AND: [
          { user: { identifier: req.query.userIdentifier } },
          { id: req.query.id },
        ],
      },
    });

    await prisma.eventParticipant.deleteMany({
      where: { eventId: id },
    });

    const data = await prisma.event.delete({
      where: { id },
    });
    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: true, message: e.message });
  }
}
