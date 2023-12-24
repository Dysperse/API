import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers(req);
    const labels = await prisma.label.findMany({ where: { spaceId } });
    return Response.json(labels);
  } catch (e) {
    return handleApiError(e);
  }
}
