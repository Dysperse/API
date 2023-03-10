import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

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
    take: 5,
  });

  res.json(data);
};

export default handler;
