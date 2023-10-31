import {
  getApiParam,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = getApiParam(req, "email", false);
    const username = getApiParam(req, "username", false);

    let data: any = await prisma.user.findFirstOrThrow({
      where: {
        OR: [
          { username: email },
          { username: username || "-1" },
          { email: email || "-1" },
        ],
      },
      select: {
        timeZone: true,
        lastActive: true,
        username: true,
        color: true,
        name: true,
        email: true,
        Status: true,
        followers: {
          where: { follower: { email } },
          select: {
            accepted: true,
          },
        },
        following: {
          where: { following: { email } },
          select: {
            accepted: true,
          },
        },
        Profile: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const id = getSessionToken();
    const bio = getApiParam(req, "bio", false);
    const hobbies = getApiParam(req, "hobbies", false);
    const workingHours = getApiParam(req, "workingHours", false);
    const picture = getApiParam(req, "picture", false);
    const birthday = getApiParam(req, "birthday", false);
    const google = getApiParam(req, "google", false);
    const spotify = getApiParam(req, "spotify", false);

    const data = await prisma.profile.updateMany({
      where: {
        user: {
          sessions: {
            some: { id },
          },
        },
      },
      data: {
        ...(bio && { bio }),
        ...(hobbies && { hobbies: JSON.parse(hobbies) }),
        ...(workingHours && { workingHours }),
        ...(picture && { picture }),
        ...(birthday && { birthday: new Date(birthday) }),
        ...(google && { google: null }),
        ...(spotify && { spotify: null }),
      },
    });
    return Response.json(data);
  } catch (e) {
    handleApiError(e);
  }
}
