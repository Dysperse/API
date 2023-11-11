import {
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";

export async function GET() {
  try {
    const sessionToken = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const data = await prisma.propertyInvite.findMany({
      include: {
        profile: {
          include: {
            members: {
              select: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    color: true,
                    Profile: { select: { picture: true } },
                  },
                },
              },
            },
          },
        },
        user: {
          select: {
            selectedProperty: { select: { id: true } },
          },
        },
      },
      where: {
        user: {
          identifier: userIdentifier,
        },
      },
    });
    return Response.json([
      ...new Map(data.map((item) => [item.propertyId, item])).values(),
    ]);
  } catch (e) {
    handleApiError(e);
  }
}
