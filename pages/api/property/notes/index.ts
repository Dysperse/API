import { prisma } from "../../../../lib/client";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data: any | null = await prisma.note.findMany({
    where: {
      property: {
        id: req.query.property,
      },
    },
  });

  res.json(data);
};

export default handler;
