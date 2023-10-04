import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    const data = await prisma.task.update({
      where: {
        id: req.query.id,
      },
      data: {
        lastUpdated: req.query.date,
        ...(req.query.name && { name: req.query.name }),
        ...(req.query.completed && {
          completed: req.query.completed === "true",
          completedAt:
            req.query.completed === "true" ? new Date(req.query.date) : null,
        }),
        ...(req.query.dateOnly && { dateOnly: req.query.dateOnly === "true" }),
        ...(req.query.pinned && { pinned: req.query.pinned === "true" }),
        ...(req.query.columnId && {
          columnId: req.query.columnId === "null" ? null : req.query.columnId,
        }),

        ...((req.query.description || req.query.description === "") && {
          description: req.query.description,
        }),
        ...((req.query.where || req.query.where === "") && {
          where: req.query.where,
        }),

        ...(req.query.due &&
          req.query.due !== "" && {
            due: req.query.due,
          }),

        ...(req.query.due === "" && {
          due: null,
        }),

        ...(req.query.color && { color: req.query.color }),

        ...(req.query.image && {
          image: req.query.image == "null" ? null : req.query.image,
        }),
      },
    });

    res.json(data);
  } catch (e: any) {
    console.log(e);
    res.json({ error: e.message });
  }
};

export default handler;
