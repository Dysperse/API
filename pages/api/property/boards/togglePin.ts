import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });
  const data = await prisma.task.update({
    where: {
      id: req.query.id,
    },
    data: {
      pinned: req.query.pinned == "true",
    },
  });

  res.json(data);
};

export default handler;
