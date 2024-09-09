import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

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

    const response = await prisma.collectionLink.findFirst({
      where: {
        collection: {
          AND: [{ id: params.id }, { userId }],
        },
      },
    });

    if (!response) {
      const data = await prisma.collectionLink.create({
        data: {
          collection: { connect: { id: params.id } },
        },
      });

      return Response.json(params);
    }

    return Response.json(response);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "refreshId", required: false },
        { name: "disabled", required: false },
        { name: "access", required: false },
      ],
      { type: "BODY" }
    );

    const data = await prisma.collectionLink.updateMany({
      where: { collection: { id: params.id } },
      data: {
        id: params.refreshId ? uuidv4() : undefined,
        access: params.access,
        disabled:
          typeof params.disabled === "boolean" ? params.disabled : undefined,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
