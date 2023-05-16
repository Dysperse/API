import { prisma } from "@/lib/server/prisma";
import cacheData from "memory-cache";

/**
 * API handler for the /api/property/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  //   Set selected to false for all other properties of the user email
  await prisma.propertyInvite.deleteMany({
    where: {
      AND: [{ user: { email: req.query.email } }, { id: req.query.id }],
    },
  });

  const data = await prisma.propertyInvite.update({
    data: { selected: true },
    where: {
      accessToken: req.query.otherPropertyAccessToken,
    },
  });

  // Clear the cache
  cacheData.del(req.query.sessionId);
  cacheData.del(req.query.sessionId);
  cacheData.del(req.query.sessionId);
  res.json(data);
};
export default handler;
