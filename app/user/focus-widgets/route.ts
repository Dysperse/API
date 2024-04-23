import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const tabs = await prisma.tab.findMany({
      where: {
        userId,
      },
      orderBy: { order: "asc" },
      include: {
        collection: {
          select: { name: true, emoji: true },
          where: {
            OR: [{ public: true }, { AND: [{ public: false }, { userId }] }],
          },
        },
      },
    });
    return Response.json(tabs);
  } catch (e) {
    return handleApiError(e);
  }
}
