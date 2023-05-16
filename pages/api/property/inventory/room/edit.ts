import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

/**
 * API handler for the /api/property/update endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.customRoom.update({
    where: { id: req.query.id },
    data: {
      ...(req.query.private && { private: req.query.private === "true" }),
      ...(req.query.name && { name: req.query.name }),
    },
  });

  res.json(data);
};
export default handler;
