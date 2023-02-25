import { prisma } from "../../../../lib/prismaClient";
import { validatePermissions } from "../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
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
