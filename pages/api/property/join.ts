import cacheData from "memory-cache";
import { prisma } from "../../../lib/prismaClient";

/**
 * API handler for the /api/property/updateInfo endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  //   Set selected to false for all other properties of the user email
  await prisma.propertyInvite.updateMany({
    where: {
      user: {
        email: req.query.email,
      },
      selected: true,
    },
    data: {
      selected: false,
    },
  });

  const data = await prisma.propertyInvite.update({
    where: {
      accessToken: req.query.accessToken1,
    },
    data: {
      selected: true,
      accepted: true,
    },
    include: {
      profile: { select: { name: true } },
    },
  });

  cacheData.del(req.query.sessionId);
  res.json(data);
};
export default handler;
