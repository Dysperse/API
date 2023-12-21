import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    const tabs = await prisma.tab.findMany({
      where: {
        userId,
      },
    });
    return Response.json(tabs);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "slug", required: true },
        { name: "params", required: false },
      ],
      { type: "BODY" }
    );
    if (params.params && typeof params.params !== "object") {
      throw new Error("Params must be an object or undefined");
    }

    const { userId } = await getIdentifiers(req);
    const tab = await prisma.tab.create({
      data: {
        slug: params.slug,
        params: params.params,
        userId,
      },
    });
    return Response.json(tab);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "id", required: true }], {
      type: "QUERY",
    });

    const { userId } = await getIdentifiers(req);

    const tab = await prisma.tab.deleteMany({
      where: {
        AND: [{ id: params.id }, { userId }],
      },
    });
    return Response.json(tab);
  } catch (e) {
    return handleApiError(e);
  }
}
