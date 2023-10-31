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

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
