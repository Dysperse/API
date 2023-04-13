// Update user settings
import { prisma } from "../../../../../lib/server/prisma";

/**
 * API handler for the /api/user/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const user = await prisma.coachData.findUnique({
    where: {
      userId: req.query.userIdentifier,
    },
  });
  res.json(user);
};
export default handler;
