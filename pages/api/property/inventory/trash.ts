import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
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
