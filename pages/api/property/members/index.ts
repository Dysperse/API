import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions({
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.propertyInvite.findMany({
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
