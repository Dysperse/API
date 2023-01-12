import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";
/**
 * API handler
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

  //  List all boards with columns, but not items
  const data = await prisma.board.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
    include: {
      columns: true,
    },
  });
  res.json(data);
};

export default handler;
