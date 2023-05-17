import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

/**
 * API handler for the /api/property/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  await validatePermissions({
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });
  const data = await prisma.customRoom.findMany({
    where: {
      OR: [
        // If the room isn't private, but the property identifer matches
        {
          AND: [
            { private: { equals: false } },
            { property: { id: { equals: req.query.property } } },
          ],
        },
        // If the room is private, but the user identifier matches the room owner
        {
          AND: [
            { private: { equals: true } },
            { userIdentifier: { equals: req.query.userIdentifier } },
          ],
        },
      ],
    },
  });
  res.json(data);
};
export default handler;
