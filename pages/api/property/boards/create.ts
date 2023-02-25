import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });
  const board = JSON.parse(req.query.board);
  console.log(board);

  const data = await prisma.board.create({
    data: {
      name: board.name,
      user: {
        connect: {
          identifier: req.query.userIdentifier,
        },
      },
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
