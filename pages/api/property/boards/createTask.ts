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

  const data = await prisma.task.create({
    data: {
      name: req.query.title,
      ...(req.query.columnId !== "-1" && {
        column: {
          connect: {
            id: parseInt(req.query.columnId),
          },
        },
      }),
      completed: false,
      ...(req.query.image && { image: req.query.image }),
      pinned: req.query.pinned === "true",
      due: req.query.due !== "false" ? new Date(req.query.due) : null,
      description: req.query.description,
      ...(req.query.parent && {
        parentTasks: {
          connect: {
            id: parseInt(req.query.parent),
          },
        },
      }),
    },
  });
  res.json(data);
};

export default handler;
