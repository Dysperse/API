import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { Notification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "email", required: true },
      ],
      { type: "BODY" }
    );

    const collectionInfo = await prisma.collection.findFirstOrThrow({
      where: { id: params.id },
      select: { name: true },
    });

    const invitedUserId = await prisma.user.findFirstOrThrow({
      where: { email: params.email },
      select: { id: true },
    });

    new Notification("COLLECTION_INVITE", {
      title: `🤝 you've been invited to "${collectionInfo.name}"`,
      body: "it's go time. just tap to start collaborating 🚀",
      data: { collectionId: params.id },
    }).dispatch(invitedUserId);

    const data = await prisma.collectionAccess.create({
      data: {
        collectionId: params.id,
        userId: params.email,
      },
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
