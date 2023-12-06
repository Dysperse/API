import {
    getIdentifiers,
    getSessionToken,
    handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const tabs = await prisma.openTab.findMany({
      where: {
        userId: userIdentifier,
      },
    });

    return Response.json(tabs);
  } catch (e) {
    return handleApiError(e);
  }
}
