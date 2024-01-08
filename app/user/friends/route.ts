import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    // get body
    const data = await prisma.follows.findMany({
      where: {
        OR: [
          { followerId: userId },
          { followingId: userId },
          { accepted: true },
        ],
      },
      select: {
        accepted: true,
        followerId: true,
        followingId: true,
        follower: {
          select: { id: true, email: true, username: true, profile: true },
        },
        following: {
          select: { id: true, email: true, username: true, profile: true },
        },
      },
    });
    // make
    data.map((user) => {
      if (user.follower.id === userId) {
        user.follower = undefined as any;
        user["user"] = user.following;
        user.following = undefined as any;
      } else if (user.following.id === userId) {
        user.following = undefined as any;
        user["user"] = user.follower;
        user.follower = undefined as any;
      }
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    // get body
    const params = await getApiParams(
      req,
      [{ name: "email", required: true }],
      { type: "BODY" }
    );

    // get body
    const followerIdRequest = await prisma.user.findFirstOrThrow({
      where: {
        OR: [{ username: params.email }, { email: params.email }],
      },
    });
    const followerId = followerIdRequest.id;
    const data = await prisma.follows.create({
      data: {
        following: {
          connect: {
            id: userId,
          },
        },
        follower: {
          connect: {
            id: followerId,
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
