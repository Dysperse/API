import { prisma } from "../../../lib/prismaClient";

/**
 * API handler for the /api/user/info endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  const data = await prisma.notificationSettings.findUnique({
    where: {
      userId: req.query.userIdentifier,
    },
  });
  res.json(data || {});
}
