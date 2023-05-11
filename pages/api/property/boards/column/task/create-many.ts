import { prisma } from "../../../../../../lib/server/prisma";
import { validatePermissions } from "../../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const tasks = JSON.parse(req.query.tasks);

  console.log(tasks);

  tasks.forEach(async (task: string) => {
    await prisma.task.create({
      data: {
        name: task || "",
        description: "",
        completed: false,
        pinned: false,
        parentTasks: { connect: { id: req.query.parent } },
        property: { connect: { id: req.query.property } },
      },
    });
  });
  res.json({ success: true });
};

export default handler;
