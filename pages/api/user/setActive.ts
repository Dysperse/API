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
  } catch (e: any) {
    res.status(500).json({ error: e.message });
  }
}
