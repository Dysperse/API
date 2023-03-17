import { prisma } from "../../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.task.update({
    data: {
      columnId: req.query.columnId,
    },
    where: {
      id: req.query.id,
    },
  });

  res.json({
    data,
    success: true,
  });
};

export default handler;
