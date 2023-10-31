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
    const action = getApiParam(req, "action", false);
    const email = getApiParam(req, "email", false);
    const userEmail = getApiParam(req, "userEmail", false);

    await prisma.user.findFirstOrThrow({
      where: {
        identifier: userIdentifier,
      },
    });
    if (action === "true") {
      await prisma.follows.update({
        where: {
          followerId_followingId: {
            followerId: email,
            followingId: userEmail,
          },
        },
        data: {
          accepted: true,
        },
      });
    } else {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: email,
            followingId: userEmail,
          },
        },
      });
    }
    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
