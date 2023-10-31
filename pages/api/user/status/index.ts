import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  try {
    validateParams(req.query, ["userIdentifier"]);
    const data = await prisma.status.findFirst({
      where: {
        userId: req.query.userIdentifier,
      },
      select: {
        status: true,
        id: true,
        started: true,
        text: true,
        until: true,
        emoji: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    res.status(401).json({ error: e.message });
  }
}
