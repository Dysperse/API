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

    //   Set selected to false for all other properties of the user email
    const f = await prisma.propertyInvite.findFirst({
      where: {
        AND: [{ user: { identifier: userIdentifier } }],
      },
    });

    if (f) {
      await prisma.propertyInvite.delete({
        where: {
          id: f.id,
        },
      });
    }

    const propertyId = await prisma.propertyInvite.findFirstOrThrow({
      where: {
        user: { identifier: userIdentifier },
      },
    });
    await prisma.user.update({
      where: {
        identifier: userIdentifier,
      },
      data: {
        selectedProperty: {
          connect: {
            id: propertyId?.propertyId,
          },
        },
      },
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
