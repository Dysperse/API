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
  const f = await prisma.propertyInvite.findFirst({
    where: {
      AND: [
        { user: { identifier: req.query.userIdentifier } },
        { accessToken: req.query.currentAccessToken },
      ],
    },
  });

  if (f) {
    await prisma.propertyInvite.delete({
      where: {
        id: f.id,
      },
    });
  }

  const data = await prisma.propertyInvite.update({
    data: { selected: true },
    where: {
      accessToken: req.query.otherPropertyAccessToken,
    },
  });

  // Clear the cache
  cacheData.clear();
  res.json(data);
};
export default handler;