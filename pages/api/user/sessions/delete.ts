import { prisma } from "../../../../lib/prismaClient";

const handler = async (req, res) => {
  const session = await prisma.session.deleteMany({
    where: {
      ...(!req.query.id
        ? {
            AND: [
              {
                user: {
                  identifier: req.query.userIdentifier || "false",
                },
              },
              {
                NOT: {
                  id: req.query.sessionId,
                },
              },
            ],
          }
        : {
            id: req.query.id,
          }),
    },
  });

  res.json(session);
};
export default handler;
