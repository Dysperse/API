import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export const getItemCount = async (res, property, accessToken) => {
  await validatePermissions({
    minimum: "read-only",
    credentials: [property, accessToken],
  });

  const data = await prisma.room.findMany({
    where: { property: { id: property } },
    select: { _count: true },
  });

  return data;
};

export default async function handler(req, res) {
  try {
    const data = await getItemCount(
      res,
      req.query.property,
      req.query.accessToken
    );

    res.json(data);
  } catch (e) {
    res.json({ error: e.message });
  }
}
