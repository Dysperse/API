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

        await prisma.task.deleteMany({
          where: {
            AND: [
              { propertyId: req.query.property || "-1" },
              { parentTasks: { some: { id } } },
            ],
          },
        });

        await prisma.task.delete({ where: { id } });
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
