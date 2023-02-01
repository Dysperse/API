import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  // Toggle star status on on an item
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const data = await prisma.item.update({
    where: {
      id: req.query.id,
    },
    data: {
      starred: req.query.starred === "true" ? false : true,
    },
  });
  res.json(data);
};

export default handler;
