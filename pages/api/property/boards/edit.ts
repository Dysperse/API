import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.board.update({
    where: {
      id: req.query.id,
    },
    data: {
      name: req.query.name,
      description: req.query.description,
    },
  });

  res.json(data);
};

export default handler;
