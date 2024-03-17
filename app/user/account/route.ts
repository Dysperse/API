import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    // get body
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [{ name: "lastReleaseVersionViewed", required: false }],
      { type: "BODY" }
    );
    const data = await prisma.user.update({
      where: { id: userId },
      data: { lastReleaseVersionViewed: params.name || undefined },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
