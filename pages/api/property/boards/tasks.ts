import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  //  List all tasks for a board from the column
  const data = await prisma.column.findMany({
    where: {
      board: {
        id: req.query.id,
      },
    },
    orderBy: {
      id: "desc",
    },
    include: {
      tasks: {
        include: {
          subTasks: true,
          parentTasks: true,
        },
      },
    },
  });

  res.json(data);
};

export default handler;
