import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions === "read-only") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  console.log(req.query.completed);
  const data: any | null = await prisma.listItem.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      completed: req.query.completed === "true" ? false : true,
    },
  });
  res.json(data);
};

export default handler;
