import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = getApiParam(req, "email", true);
    const accessToken1 = getApiParam(req, "accessToken1", true);
    await prisma.propertyInvite.updateMany({
      where: {
        AND: [{ user: { email } }, { selected: { equals: true } }],
      },
      data: { selected: false },
    });

    const data = await prisma.propertyInvite.update({
      where: { accessToken: accessToken1 },
      data: { selected: true, accepted: true },
      include: {
        profile: { select: { name: true } },
      },
    });

    // Clear the cache
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
