import {
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const data = await prisma.propertyInvite.findMany({
      include: {
        profile: true,
      },
      where: {
        AND: [
          {
            user: {
              is: {
                identifier: userIdentifier,
              },
            },
          },
          { selected: false },
        ],
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
