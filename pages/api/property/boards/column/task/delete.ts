import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const subtasks = await prisma.task.deleteMany({
    where: {
      AND: [
        { propertyId: req.query.property || "-1" },
        { parentTasks: { some: { id: req.query.id || "-1" } } },
      ],
    },
  });

  console.log(subtasks);

  const data = await prisma.task.delete({
    where: { id: req.query.id },
  });

  res.json(data);
};

export default handler;
