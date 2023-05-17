import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions({
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
