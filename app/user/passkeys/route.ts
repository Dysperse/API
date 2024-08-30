import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Methods": "POST,  PATCH, OPTIONS",
    },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const data = await prisma.passkey.findMany({ where: { userId } });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "friendlyName", required: true },
    ]);

    const data = await prisma.passkey.updateMany({
      where: { AND: [{ id: params.id }, { userId }] },
      data: { friendlyName: params.friendlyName },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const data = await prisma.passkey.deleteMany({
      where: { AND: [{ id: params.id }, { userId }] },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
