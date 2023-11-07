import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const propertyId = await getApiParam(req, "propertyId", true);

    await prisma.propertyInvite.findFirstOrThrow({
      where: { propertyId },
    });

    const data = await prisma.user.update({
      where: { identifier: userIdentifier },
      data: { selectedProperty: { connect: { id: propertyId } } },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
