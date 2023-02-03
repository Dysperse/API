import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

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
