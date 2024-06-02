import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "userList", required: true },
      ],
      { type: "BODY" }
    );

    const collection = await prisma.collectionAccess.findMany({
      where: {
        AND: [{ collectionId: params.id }, { user: { isNot: null } }],
      },
      select: {
        user: { select: { id: true } },
      },
    });

    // see these 2 arrays and get emails which are not in the collection
    const emails: string[] = params.userList.filter(
      (id) => !collection.find((c) => c.user?.id === id)
    );

    const data = await prisma.collectionAccess.createMany({
      data: emails.map((id) => ({
        collectionId: params.id,
        userId: id,
      })),
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const data = await prisma.collectionAccess.delete({
      where: { id: params.id },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
