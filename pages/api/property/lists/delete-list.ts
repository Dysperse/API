import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

/**
 * API handler
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
const handler = async (req, res) => {
  const permissions: null | string = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );

  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  // Delete from listitems where listId = req.query.listId
  await prisma.listItem.deleteMany({
    where: {
      listId: parseInt(req.query.parent),
    },
  });

  // Delete list where id = req.query.listId
  const data2: any | null = await prisma.list.delete({
    where: {
      id: parseInt(req.query.parent),
    },
  });
  res.json(data2);
};
export default handler;
