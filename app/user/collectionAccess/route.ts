import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const data = await prisma.collectionAccess.findMany({
      where: { userId },
      select: {
        hasSeen: true,
        collection: {
          include: {
            _count: true,
            integration: true,
            createdBy: {
              select: {
                email: true,
                username: true,
                profile: { select: { name: true, picture: true } },
              },
            },
          },
        },
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
