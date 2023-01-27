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
  const data = await prisma.inboxItem.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
    orderBy: {
      id: "desc",
    },
  });

  res.json(data);
};
export default handler;
