import { getIdentifiers, getSessionToken, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export const getItemCount = async (property) => {
  const data = await prisma.room.findMany({
    where: { property: { id: property } },
    select: { _count: true },
  });

  return data;
};

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const data = await getItemCount(spaceId);

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
