import { prisma } from "../../../../../lib/prismaClient";
import { validatePermissions } from "../../../../../lib/server/validatePermissions";

export const getItemCount = async (res, property, accessToken, room) => {
  await validatePermissions(res, {
    minimum: "read-only",
    credentials: [property, accessToken],
  });

  const data = await prisma.item.findMany({
    where: {
      property: {
        id: property,
      },
    },
    select: { room: true },
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

  return {
    count: data.length,
    byRoom: grouped,
  };
};

export default async function handler(req, res) {
  const data = await getItemCount(
    res,
    req.query.property,
    req.query.accessToken,
    req.query.room
  );

  res.json(data);
}
