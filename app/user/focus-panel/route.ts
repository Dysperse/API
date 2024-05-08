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
    },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const data = await prisma.widget.findMany({
      where: { userId },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "type", required: true },
        { name: "order", required: true },
        { name: "params", required: false },
      ],
      { type: "BODY" }
    );
    const { userId } = await getIdentifiers();

    const data = await prisma.widget.create({
      data: {
        userId,
        params: params.params || {},
        order: params.order,
        type: params.type,
      },
    });
    return Response.json(data);
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
        { name: "type", required: false },
        { name: "order", required: false },
        { name: "params", required: false },
      ],
      { type: "BODY" }
    );

    const data = await prisma.widget.update({
      where: { id: params.id },
      data: {
        params: typeof params.params === "object" ? params.params : {},
        order: typeof params.order === "string" ? params.order : undefined,
        type: typeof params.type === "string" ? params.type : undefined,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "id", required: true }]);
    const data = await prisma.widget.delete({ where: { id: params.id } });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
