import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionId = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionId);
    const email = await getApiParam(req, "email", true);
    const userEmail = await getApiParam(req, "userEmail", true);

    await prisma.user.findFirstOrThrow({
      where: {
        identifier: userIdentifier,
      },
    });

    await prisma.follows.delete({
      where: {
        followerId_followingId: {
          followerId: userEmail,
          followingId: email,
        },
      },
    });
    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
