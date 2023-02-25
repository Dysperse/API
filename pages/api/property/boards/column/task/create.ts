import { prisma } from "../../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.task.create({
    data: {
      property: {
        connect: {
          id: req.query.property,
        },
      },
      name: req.query.title,
      ...(req.query.columnId !== "-1" && {
        column: {
          connect: {
            id: req.query.columnId,
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
            id: req.query.parent,
          },
        },
      }),
    },
  });
  res.json(data);
};

export default handler;
