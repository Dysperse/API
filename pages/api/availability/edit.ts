import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["userIdentifier", "id"]);

    const event = await prisma.event.findFirstOrThrow({
      where: {
        AND: [
          { id: req.query.id },
          { user: { identifier: req.query.userIdentifier } },
        ],
      },
    });

    const data = await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        name: req.query.name,
        description: req.query.description,
        location: req.query.location,
      },
    });
    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: true, message: e.message });
  }
}
