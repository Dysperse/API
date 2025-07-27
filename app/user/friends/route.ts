import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { Notification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    // get body
    const params = await getApiParams(
      req,
      [{ name: "email", required: true }],
      { type: "BODY" }
    );

    // get body
    const followingIdRequest = await prisma.user.findFirstOrThrow({
      where: {
        OR: [{ username: params.email }, { email: params.email }],
      },
    });

    const follower = await prisma.user.findFirstOrThrow({
      where: {
        id: userId,
      },
      select: { profile: { select: { name: true } } },
    });
    const followingId = followingIdRequest.id;
    const data = await prisma.follows.create({
      data: {
        follower: {
          connect: {
            id: userId,
          },
        },
        following: {
          connect: {
            id: followingId,
          },
        },
      },
    });

    // send notification
    new Notification("FRIEND_REQUEST_SEND", {
      title: "You have a new friend request",
      body: `${
        follower?.profile?.name || "A Dysperse user"
      } wants to be your friend`,
      data: {
        type: "FRIEND_REQUEST",
        userId,
      },
    }).dispatch(followingId);
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    // get body
    const params = await getApiParams(
      req,
      [{ name: "userId", required: true }],
      { type: "BODY" }
    );

    const data = await prisma.follows.deleteMany({
      where: {
        OR: [
          {
            AND: [{ followerId: userId }, { followingId: params.userId }],
          },
          {
            AND: [{ followerId: params.userId }, { followingId: userId }],
          },
        ],
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    // get body
    const params = await getApiParams(
      req,
      [
        { name: "blocked", required: false },
        { name: "accepted", required: false },
        { name: "followerId", required: true },
        { name: "followingId", required: true },
      ],
      { type: "BODY" }
    );

    // Send the notification that "@___" has accepted your friend request
    if (params.accepted) {
      const follower = await prisma.user.findFirstOrThrow({
        where: {
          id: params.followerId,
        },
        select: { profile: { select: { name: true } } },
      });
      const following = await prisma.user.findFirstOrThrow({
        where: {
          id: params.followingId,
        },
        select: { profile: { select: { name: true } } },
      });
      new Notification("FRIEND_REQUEST_ACCEPT", {
        title: "Friend request accepted",
        body: `${
          following?.profile?.name || "A Dysperse user"
        } has accepted your friend request`,
        data: {
          type: "FRIEND_REQUEST",
          userId: params.followingId,
        },
      }).dispatch(params.followerId);
    }

    const data = await prisma.follows.update({
      where: {
        followerId_followingId: {
          followerId: params.followerId,
          followingId: params.followingId,
        },
      },
      data: {
        blocked:
          typeof params.blocked === "boolean"
            ? Boolean(params.blocked)
            : undefined,
        accepted:
          typeof params.accepted === "boolean"
            ? Boolean(params.accepted)
            : undefined,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
