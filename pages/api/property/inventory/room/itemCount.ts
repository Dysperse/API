import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

const handler = async (req, res) => {
  const permissions = await validatePermissions(
    req.query.property,
    req.query.accessToken
  );
  if (!permissions) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  const data = await prisma.item.findMany({
    cacheStrategy: { swr: 60, ttl: 60 },
    where: {
      room: req.query.room,
      property: {
        id: req.query.property,
      },
    },
    select: {
      room: true,
    },
  });

  // Create object of room names and have the values be the number of times the room name occures
  const grouped = data.reduce((acc, item) => {
    if (acc[item.room]) {
      acc[item.room] += 1;
    } else {
      acc[item.room] = 1;
    }
    return acc;
  }, {});

  res.json({
    count: data.length,
    byRoom: grouped,
  });
};

export default handler;
