import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import dayjs from "dayjs";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  try {
    validateParams(req.query, ["userIdentifier"]);

    const status = {
      status: req.query.status,
      started: new Date(req.query.start),
      until: dayjs(req.query.start).add(req.query.until, "minutes").toDate(),
      user: { connect: { identifier: req.query.userIdentifier } },
    };

    await prisma.status.upsert({
      where: {
        userId: req.query.userIdentifier,
      },
      update: status,
      create: status,
    });
    res.json({ success: true });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
}
