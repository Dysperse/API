import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions({
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.column.create({
    data: {
      name: req.query.title,
      emoji: req.query.emoji,
      board: {
        connect: {
          id: req.query.id,
        },
      },
    },
  });
  res.json(data);
};

export default handler;
