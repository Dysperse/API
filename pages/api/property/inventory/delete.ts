import { prisma } from "../../../../lib/client";
import CryptoJS from "crypto-js";
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
  const data: any | null = await prisma.item.delete({
    where: {
      id: parseInt(req.query.id),
    },
  });
  res.json(data);
};

export default handler;
