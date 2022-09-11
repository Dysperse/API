import { prisma } from "../../../lib/client";
import { validatePermissions } from "../../../lib/validatePermissions";

const handler = async (req: any, res: any) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions || permissions !== "member") {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  //   Update name, type, and bannerColor
  const data: any | null = await prisma.property.update({
    where: {
      id: req.query.property,
    },
    data: {
      name: req.query.name || undefined,
      type: req.query.type || undefined,
      bannerColor: req.query.bannerColor || undefined,
    },
  });

  res.json(data);
};
export default handler;
