import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { userId } = await getIdentifiers();
    const data = await prisma.session.findMany({
      where: { userId },
      orderBy: { timestamp: "desc" },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "all", required: false },
    ]);
    const data = await prisma.session.deleteMany({
      where: {
        AND: [{ id: params.all ? { not: params.id } : params.id }, { userId }],
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
