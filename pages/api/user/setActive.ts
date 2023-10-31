import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";

export default async function handler(req, res) {
  try {
    await prisma.user.update({
      where: {
        identifier: req.query.userIdentifier,
      },
      data: {
        lastActive: dayjs().tz(req.query.timeZone).toDate(),
      },
    });
    res.json({ success: true });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
