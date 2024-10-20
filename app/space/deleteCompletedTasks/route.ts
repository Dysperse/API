import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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
    const { spaceId } = await getIdentifiers();
    const response = await prisma.entity.updateMany({
      where: {
        AND: [
          { spaceId },
          { recurrenceRule: { equals: Prisma.AnyNull } },
          {
            completionInstances: {
              some: {
                completedAt: {
                  // never matches
                  not: { equals: new Date(1000, 20, 20, 10, 20, 1, 20) },
                },
              },
            },
          },
        ],
      },
      data: {
        trash: true,
      },
    });
    return Response.json(response, { status: 200 });
  } catch (e) {
    return handleApiError(e);
  }
}
