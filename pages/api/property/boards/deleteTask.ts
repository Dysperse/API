import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  await prisma.task.deleteMany({
    where: {
      subTasks: {
        some: {
          parentTasks: {
            some: {
              id: parseInt(req.query.id),
            },
          },
        },
      },
    },
  });
  const data = await prisma.task.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });

  res.json(data);
};

export default handler;
