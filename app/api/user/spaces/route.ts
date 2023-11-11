import { getIdentifiers, getSessionToken } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
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
    console.log(data)
    return Response.json([
      ...new Map(data.map((item) => [item.propertyId, item])).values(),
    ]);
  } catch (e) {}
}
