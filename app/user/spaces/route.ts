import { getIdentifiers } from "@/lib/getIdentifiers";
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
    const { userId } = await getIdentifiers();
    const tabs = await prisma.spaceInvite.findMany({
      where: { userId },
      include: { space: { include: { _count: true } } },
    });
    return Response.json(tabs);
  } catch (e) {
    return handleApiError(e);
  }
}
