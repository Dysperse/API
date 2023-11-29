import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = await getApiParam(req, "email", true);
    const data = await prisma.completionInstance.findMany({
      where: {
        task: {
          createdBy: { email },
        },
      },
      include: {
        task: {
          select: {
            pinned: true,
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
