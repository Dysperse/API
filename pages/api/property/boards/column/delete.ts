import { prisma } from "../../../../../lib/server/prisma";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  // Delete column, and all tasks in it
  const data = await prisma.column.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
};

export default handler;
