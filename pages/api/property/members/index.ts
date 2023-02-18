import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.propertyId,
    req.query.propertyAccessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.propertyInvite.findMany({
    cacheStrategy: { swr: 60, ttl: 60 },
    where: {
      propertyId: req.query.propertyId,
    },
    select: {
      id: true,
      permission: true,
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  res.json(data);
};
export default handler;
