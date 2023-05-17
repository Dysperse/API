import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

/**
 * API handler for the /api/property/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.customRoom.create({
      data: {
        name: req.query.name,
        private: req.query.private === "true",
        property: {
          connect: { id: req.query.property },
        },
        user: {
          connect: {
            identifier: req.query.userIdentifier,
          },
        },
      },
      include: {
        property: true,
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};
export default handler;
