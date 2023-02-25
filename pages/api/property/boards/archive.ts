import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.board.update({
    where: {
      id: req.query.id,
    },
    data: {
      archived: req.query.archive === "true",
    },
  });

  res.json(data);
};

export default handler;
