import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  // Delete column, and all tasks in it
  const data = await prisma.column.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
};

export default handler;
