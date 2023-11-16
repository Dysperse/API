import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);

function removeDuplicateFriends(data) {
  const uniqueFriends = new Set();
  const filteredData: any = [];

  for (const friend of data) {
    const friendPair = `${friend.followerId}-${friend.followingId}`;
    const friendPair2 = `${friend.followingId}-${friend.followerId}`;

    if (!uniqueFriends.has(friendPair) && !uniqueFriends.has(friendPair2)) {
      uniqueFriends.add(friendPair);
      filteredData.push(friend);
    }
  }

  return filteredData;
}

export function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle.
  while (currentIndex != 0) {
    // Pick a remaining element.
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const user = await prisma.user.findFirstOrThrow({
      where: { identifier: userIdentifier },
      select: {
        name: true,
        email: true,
        username: true,
        Profile: true,
        lastActive: true,
        timeZone: true,
      },
    });

    const friends: any = await prisma.follows.findMany({
      where: {
        OR: [
          {
            AND: [{ following: { email: user.email } }, { accepted: true }],
          },
          {
            AND: [{ follower: { email: user.email } }, { accepted: true }],
          },
        ],
      },
      orderBy: [
        { follower: { lastActive: "desc" } },
        { following: { lastActive: "desc" } },
      ],
      include: {
        follower: {
          select: {
            Status: true,
            name: true,
            email: true,
            color: true,
            timeZone: true,
            username: true,
            lastActive: true,
            Profile: {
              select: {
                birthday: true,
                spotify: true,
                picture: true,
                workingHours: true,
              },
            },
          },
        },
        following: {
          select: {
            Status: true,
            name: true,
            email: true,
            color: true,
            timeZone: true,
            username: true,
            lastActive: true,
            Profile: {
              select: {
                birthday: true,
                spotify: true,
                picture: true,
                workingHours: true,
              },
            },
          },
        },
      },
    });

    let unique = removeDuplicateFriends(friends)
      .map((friend) => {
        if (friend.following.email === user.email)
          return { ...friend, following: undefined };
        if (friend.follower.email === user.email)
          return { ...friend, follower: undefined };

        return friend;
      })
      .sort(
        (a, b) =>
          (b.follower || b.following).lastActive -
          (a.follower || a.following).lastActive
      );
    return Response.json({
      user,
      friends: unique,
    });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const followerEmail = await getApiParam(req, "followerEmail", true);
    const followingEmail = await getApiParam(req, "followingEmail", true);

    try {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: followerEmail,
            followingId: followingEmail,
          },
        },
      });
    } catch (e) {}
    try {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: followingEmail,
            followingId: followerEmail,
          },
        },
      });
    } catch (e) {}
    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const followerEmail = await getApiParam(req, "followerEmail", true);
    const followingEmail = await getApiParam(req, "followingEmail", true);

    const victim = await prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: followingEmail }, { username: followingEmail }],
      },
      select: {
        notifications: {
          select: { pushSubscription: true, followerUpdates: true },
        },
        email: true,
      },
    });

    if (
      victim.notifications?.pushSubscription &&
      victim.notifications?.followerUpdates
    ) {
      try {
        await DispatchNotification({
          subscription: victim.notifications.pushSubscription as any,
          title: "You have a new friend request",
          body: "Tap to manage",
        });
      } catch {}
    }

    await prisma.follows.upsert({
      where: {
        followerId_followingId: {
          followerId: followerEmail,
          followingId: victim.email,
        },
      },
      update: {
        accepted: false,
      },
      create: {
        follower: { connect: { email: followerEmail } },
        following: { connect: { email: victim.email } },
      },
    });
    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
