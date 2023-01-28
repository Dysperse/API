import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) return res.status(401).json({ error: "Unauthorized" });
  console.log("desc: " + req.query.description);

  const data = await prisma.task.update({
    where: {
      id: parseInt(req.query.id),
    },
    data: {
      ...(req.query.name && { name: req.query.name }),
      ...((req.query.description || req.query.description === "") && {
        description: req.query.description,
      }),
      ...(req.query.color && { color: req.query.color }),
    },
  });

  res.json(data);
};

export default handler;
