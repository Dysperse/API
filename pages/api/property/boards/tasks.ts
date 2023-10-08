import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });

    //  List all tasks for a board from the column
    const data = await prisma.column.findMany({
      where: {
        board: { id: req.query.id },
      },
      orderBy: { order: "asc" },
      include: {
        tasks: {
          include: {
            subTasks: true,
            parentTasks: true,
            createdBy: {
              select: {
                name: true,
                email: true,
                Profile: {
                  select: { picture: true },
                },
              },
            },
          },
          // Don't select subtasks
          where: {
            parentTasks: {
              none: {
                column: {
                  board: { id: req.query.id },
                },
              },
            },
          },
          orderBy:
            req.query.filter === "a-z"
              ? { name: "asc" }
              : req.query.filter === "date"
              ? { due: "desc" }
              : req.query.filter === "modification"
              ? { lastUpdated: "desc" }
              : req.query.filter === "color"
              ? { color: "desc" }
              : req.query.filter === "attachment"
              ? { image: "desc" }
              : req.query.filter === "completed-at"
              ? { completedAt: "desc" }
              : req.query.filter === "notifications"
              ? { notifications: "desc" }
              : req.query.filter === "subtasks"
              ? { subTasks: { _count: "desc" } }
              : { pinned: "desc" },
        },
      },
    });

    res.json(data);
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
