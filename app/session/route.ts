import { getIdentifiers } from "@/lib/getIdentifiers";
import { getSessionData } from "@/lib/getSessionData";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // get body
    const { sessionId, userId } = await getIdentifiers();
    prisma.profile.update({
      where: { userId },
      data: {
        lastActive: new Date(),
      },
    });
    const user = await getSessionData(sessionId as string);

    return Response.json(user);
  } catch (e) {
    return handleApiError(e);
  }
}
