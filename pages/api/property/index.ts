import { prisma } from "../../../lib/prismaClient";
import { validatePermissions } from "../../../lib/server/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.propertyInvite.findMany({
    where: {
      AND: [
        { propertyId: req.query.id },
        {
          accessToken: req.query.propertyAccessToken,
        },
      ],
    },
    include: {
      profile: {
        include: {
          members: { select: { id: true } },
        },
      },
    },
    take: 1,
  });

  res.json(data[0]);
};
export default handler;
