import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  //  List all boards with columns, but not items
  const data = await prisma.task.count({
    where: {
      propertyId: req.query.property,
    },
  });
  res.json(data);
};

export default handler;
