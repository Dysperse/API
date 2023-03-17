import { prisma } from "../../lib/server/prisma";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  await prisma.user.findFirst({
    select: {
      id: true,
    },
  });
  res.json({ success: true });
}
