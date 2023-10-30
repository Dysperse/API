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
          connect: {
            email: req.query.createdBy,
          },
        },
        notifications: JSON.parse(req.query.notifications),
        name: req.query.title,
        color: req.query.color || "grey",
        completed: false,
        ...(req.query.image && { image: req.query.image }),
        pinned: req.query.pinned === "true",
        due: req.query.due !== "false" ? new Date(req.query.due) : null,
        description: req.query.description,
        ...(req.query.location && { where: req.query.location }),
        ...(req.query.recurrenceRule && {
          recurrenceRule: req.query.recurrenceRule,
        }),
        ...(req.query.columnId !== "-1" && {
          column: {
            connect: {
              id: req.query.columnId,
            },
          },
        }),
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
