import { prisma } from "../../../../lib/prismaClient";

const handler = async (req, res) => {
  const session = await prisma.session.findMany({
    where: {
      user: {
        identifier: req.query.userIdentifier || "false",
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  res.json(session);
};
export default handler;
