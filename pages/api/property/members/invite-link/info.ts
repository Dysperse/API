import { prisma } from "../../../../../lib/prismaClient";

const handler = async (req, res) => {
  const data = await prisma.propertyLinkInvite.findUnique({
    cacheStrategy: { swr: 60, ttl: 60 },
    where: {
      token: req.query.token,
    },
    select: {
      property: true,
    },
  });

  res.json(data ? data : { error: "Invalid token" });
};
export default handler;
