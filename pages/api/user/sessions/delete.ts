import cacheData from "memory-cache";
import { prisma } from "../../../../lib/prismaClient";

const handler = async (req, res) => {
  if (!req.query.id) {
    const sessions = await prisma.session.findMany({
      cacheStrategy: { swr: 60, ttl: 60 },
      where: {
        user: {
          identifier: req.query.userIdentifier || "false",
        },
      },
      select: {
        id: true,
      },
    });
    if (sessions) {
      for (let i = 0; i < sessions.length; i++) {
        cacheData.del(sessions[i].id);
      }
    }
  }
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

  if (req.query.id) {
    cacheData.del(req.query.id);
  }
  cacheData.del(req.query.sessionId);
  res.json(session);
};
export default handler;
