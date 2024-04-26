import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

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
