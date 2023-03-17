import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });
  const data = await prisma.inboxItem.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  res.json(data);
};
export default handler;
