import { prisma } from "../../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  await prisma.task.deleteMany({
    where: {
      subTasks: {
        some: {
          parentTasks: {
            some: {
              id: req.query.id,
            },
          },
        },
      },
    },
  });
  const data = await prisma.task.delete({
    where: {
      id: req.query.id,
    },
  });

  res.json(data);
};

export default handler;
