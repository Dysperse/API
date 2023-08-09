import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    validateParams(req.query, ["selection"]);

    const selection = JSON.parse(req.query.selection);
    let errors = 0;

    for (let i = 0; i < selection.length; i++) {
      try {
        const id = selection[i];

        await prisma.task.updateMany({
          where: { id },
          data: {
            ...(req.query.color && { color: req.query.color }),
            ...(req.query.due && { due: new Date(req.query.due) }),
            ...(req.query.completed && {
              completed: Boolean(req.query.completed),
            }),
          },
        });
      } catch {
        errors++;
      }
    }

    res.json({ success: true, errors });
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
