import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["userIdentifier"]);

    const data = await prisma.event.create({
      data: {
        name: req.query.name,
        startDate: new Date(req.query.startDate),
        endDate: new Date(req.query.endDate),
        timeZone: req.query.timeZone,
        user: { connect: { identifier: req.query.userIdentifier } },
      },
    });
    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.status(400).json({ error: true, message: e.message });
  }
}
