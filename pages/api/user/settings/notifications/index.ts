import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["userIdentifier"]);
    const data = await prisma.notificationSettings.findUnique({
      where: { userId: req.query.userIdentifier },
    });
    const mine = await prisma.notificationSettings.findUnique({
      where: { userId: req.query.userIdentifier },
    });
    res.json(data || {});
  } catch (e: any) {
    res.json({ error: e.message });
  }
}
