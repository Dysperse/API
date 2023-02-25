import { prisma } from "../../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../../lib/validatePermissions";

const handler = async (req, res) => {
await validatePermissions(res, {
  minimum: "read-only",
  credentials: [req.query.property, req.query.accessToken],
});

  const data = await prisma.task.findUnique({
    where: {
      id: req.query.id,
    },
    include: {
      parentTasks: true,
      subTasks: true,
    },
  });
  res.json(data);
};

export default handler;
