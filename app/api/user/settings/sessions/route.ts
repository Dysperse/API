import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET() {
  try {
    const sessionId = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionId);

    const session = await prisma.session.findMany({
      where: {
        user: {
          identifier: userIdentifier,
        },
      },
      orderBy: {
        timestamp: "asc",
      },
    });

    return Response.json(session);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  const id = getApiParam(req, "id", false);
  const sessionId = await getSessionToken();
  const { userIdentifier } = await getIdentifiers(sessionId);

  if (!id) {
    await prisma.session.findMany({
      where: {
        user: { identifier: userIdentifier },
      },
      select: {
        id: true,
      },
    });
  }

  const session = await prisma.session.deleteMany({
    where: {
      ...(!id
        ? {
            AND: [
              {
                user: { identifier: userIdentifier },
              },
              {
                NOT: {
                  id: sessionId,
                },
              },
            ],
          }
        : { id }),
    },
  });

  return Response.json(session);
}
