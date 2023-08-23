import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
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
        createdBy: {
          user: {
            connect: {
              email: req.query.email,
            },
          },
        },
        name: req.query.title,
        ...(req.query.location && { where: req.query.location }),
        ...(req.query.columnId !== "-1" && {
          column: {
            connect: {
              id: req.query.columnId,
            },
          },
        }),
        color: req.query.color || "grey",
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
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
