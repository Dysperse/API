import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    await validateParams(req.query, ["userIdentifier"]);

    const data = await prisma.event.create({
      data: {
        name: req.query.name,
        description: req.query.description,
        location: req.query.description,
        startDate: new Date(req.query.startDate),
        endDate: new Date(req.query.endDate),
        timeZone: req.query.timeZone,
        excludingDates: JSON.parse(req.query.excludingDates),
        excludingHours: JSON.parse(req.query.excludingHours),
        user: { connect: { identifier: req.query.userIdentifier } },
      },
    });
    return Response.json(data);
  } catch (e) {
    res.status(400).json({ error: true, message: e.message });
  }
}
