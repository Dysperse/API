import { handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    //   Set selected to false for all other properties of the user email
    const f = await prisma.propertyInvite.findFirst({
      where: {
        AND: [
          { user: { identifier: { equals: req.query.userIdentifier } } },
          { accessToken: { equals: req.query.currentAccessToken } },
        ],
      },
    });

    if (f) {
      await prisma.propertyInvite.delete({
        where: {
          id: f.id,
        },
      });
    }

    const data = await prisma.propertyInvite.update({
      data: { selected: true },
      where: { accessToken: req.query.otherPropertyAccessToken },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
