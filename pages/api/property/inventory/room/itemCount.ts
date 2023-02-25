import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/validatePermissions";

const handler = async (req, res) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [req.query.property, req.query.accessToken],
  });

  const data = await prisma.item.findMany({
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
