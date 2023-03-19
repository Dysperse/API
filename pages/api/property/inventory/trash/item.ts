import { prisma } from "../../../../../lib/server/prisma";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "member",
    credentials: [req.query.property, req.query.accessToken],
  });

  if (req.query.forever) {
    //   Delete an item
    const data = await prisma.item.delete({
      where: {
        id: req.query.id,
      },
    });
    res.json(data);
  } else {
    //   Update the note on an item
    const data = await prisma.item.update({
      where: {
        id: req.query.id,
      },
      data: {
        trash: true,
      },
    });
    res.json(data);
  }
};

export default handler;
