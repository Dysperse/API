import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const insights = await prisma.userInsight.findMany({
      where: { userId },
      select: { year: true },
    });

    return Response.json({ years: insights.map((e) => e.year) });
  } catch (e) {
    return handleApiError(e);
  }
}
