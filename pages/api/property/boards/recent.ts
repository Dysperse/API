import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.task.findMany({
    where: {
      AND: [
        { property: { id: req.query.property } },
        { NOT: { completed: true } },
      ],
    },
    orderBy: {
      lastUpdated: "desc",
    },
    take: parseInt(req.query.take),
  });

  res.json(data);
};

export default handler;
