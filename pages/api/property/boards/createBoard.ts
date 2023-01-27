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
  const board = JSON.parse(req.query.board);
  console.log(board);

  const data = await prisma.board.create({
    data: {
      name: board.name,
      columns: {
        createMany: {
          data: board.columns.map((column) => ({
            name: column.name,
            emoji: column.emoji,
          })),
        },
      },
      property: {
        connect: {
          id: req.query.property,
        },
      },
    },
  });
  res.json(data);
};

export default handler;
