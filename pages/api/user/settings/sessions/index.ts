import { prisma } from "@/lib/server/prisma";

export async function GET(req: NextRequest) {
  const session = await prisma.session.findMany({
    where: {
      user: {
        identifier: req.query.userIdentifier || "false",
      },
    },
    orderBy: {
      timestamp: "asc",
    },
  });

  return Response.json(session);
}
