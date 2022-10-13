import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler for the /api/property/notes endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.note.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
  });

  res.json(data);
};

export default handler;
