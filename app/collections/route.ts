import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { getLabelOrder } from "./getLabelOrder";

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
    const params = await getApiParams(req, [{ name: "id", required: true }]);
    const collection = await prisma.collection.findFirstOrThrow({
      where: {
        OR: [
          // If the user is the owner of the collection
          {
            AND: [{ id: params.id }, { userId }],
          },
          // If the user is invited to the collection
          {
            AND: [{ id: params.id }, { invitedUsers: { some: { userId } } }],
          },
        ],
      },
      include: { _count: true },
    });

    return Response.json({
      collection,
      kanbanOrder: getLabelOrder(collection),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
