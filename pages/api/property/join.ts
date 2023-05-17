import { prisma } from "@/lib/server/prisma";
import cacheData from "memory-cache";

/**
 * API handler for the /api/property/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  try {
    //   Set selected to false for all other properties of the user email
    await prisma.propertyInvite.updateMany({
      where: {
        AND: [
          { user: { email: { equals: req.query.email } } },
          { selected: { equals: true } },
        ],
      },
      data: { selected: false },
    });

    const data = await prisma.propertyInvite.update({
      where: { accessToken: req.query.accessToken1 },
      data: { selected: true, accepted: true },
      include: {
        profile: { select: { name: true } },
      },
    });

    // Clear the cache
    cacheData.del(req.query.sessionId);
    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
