import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  try {
    validateParams(req.query, ["id", "completedAt"]);
    await validatePermissions({
      minimum: "member",
      credentials: [req.query.property, req.query.accessToken],
    });

    console.log(req.query);

    if (req.query.isCompleted === "true") {
      const data = await prisma.completionInstance.create({
        data: {
          completedAt: new Date(req.query.completedAt),
          task: { connect: { id: req.query.id } },
          ...(req.query.iteration && {
            iteration: new Date(req.query.iteration),
          }),
        },
      });
      res.json(data);
    } else {
      const data = await prisma.completionInstance.deleteMany({
        where: req.query.iteration
          ? {
              AND: [
                { taskId: req.query.id },
                { iteration: new Date(req.query.iteration) },
              ],
            }
          : {
              taskId: req.query.id,
            },
      });
      res.json(data);
    }
  } catch (e: any) {
    res.json({ error: e.message });
  }
};

export default handler;
