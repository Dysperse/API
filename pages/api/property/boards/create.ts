import { prisma } from "../../../../lib/server/prisma";
import { validatePermissions } from "../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });
  const board = JSON.parse(req.query.board);
  

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
            emoji: column.emoji
              .replace(
                "https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/",
                ""
              )
              .replace(".png", ""),
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
