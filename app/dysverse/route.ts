import { getApiParams } from "@/lib/getApiParams";
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
    const params = await getApiParams(req, [
      { name: "cursor", required: false },
      { name: "id", required: false },
    ]);

    const data = await prisma.collection.findMany({
      where: {
        AND: [{ id: params.id || undefined }, { public: true }],
      },
      select: {
        id: true,
        name: true,
        defaultView: true,
        emoji: true,
        category: true,
        kanbanOrder: true,
        gridOrder: true,
        shareItems: true,
        description: true,
        keepAuthorAnonymous: true,
        showCompleted: true,
        labels: { select: { name: true, emoji: true, color: true } },
        createdBy: {
          select: {
            email: true,
            profile: {
              select: { name: true, picture: true, theme: true },
            },
            id: true,
          },
        },
      },
      take: 50,
      cursor: params.cursor ? { id: params.cursor } : undefined,
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
