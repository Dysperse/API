import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();

    const data = await prisma.space.findFirstOrThrow({
      where: { id: spaceId },
      select: { _count: true },
    });

    const instances = await prisma.completionInstance.findMany({
      where: {
        AND: [{ task: { spaceId } }, { completedAt: { not: null } }],
      },
      select: { completedAt: true },
    });

    return Response.json({
      ...data,
      completionInstances: instances,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
