import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  //   Update the note on an item
  const data = await prisma.item.update({
    where: {
      id: req.query.id,
    },
    data: {
      room: req.query.room,
    },
  });

  res.json(data);
};

export default handler;
