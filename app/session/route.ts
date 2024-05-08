import { getIdentifiers } from "@/lib/getIdentifiers";
import { getSessionData } from "@/lib/getSessionData";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { sessionId, userId } = await getIdentifiers();
    await prisma.profile.update({
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
