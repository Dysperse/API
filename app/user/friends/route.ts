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
        OR: [{ followerId: userId }, { followingId: userId }],
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
