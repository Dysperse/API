import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";
import dayjs from "dayjs";

function removeDuplicateFriends(data) {
  const uniqueFriends = new Set();
  const filteredData: any = [];

  for (const friend of data) {
    const friendPair = `${friend.followerId}-${friend.followingId}`;

    if (!uniqueFriends.has(friendPair)) {
      uniqueFriends.add(friendPair);
      filteredData.push(friend);
    }
  }

  return filteredData;
}

function sortFriendsByStatusAndActivity(friendsData, userTimeZone) {
  return friendsData.sort((friendA, friendB) => {
    // Sort by status and expiration within user's timezone
    if (friendA.following.Status && friendB.following.Status) {
      const currentTimeInUserTZ = dayjs().tz(userTimeZone);
      const statusExpirationA = dayjs(friendA.following.Status.until).tz(
        userTimeZone
      );
      const statusExpirationB = dayjs(friendB.following.Status.until).tz(
        userTimeZone
      );

      if (
        statusExpirationA.isAfter(currentTimeInUserTZ) &&
        statusExpirationB.isAfter(currentTimeInUserTZ)
      ) {
        // Both friends have active statuses within user's timezone, sort by activity
        const lastActiveA = dayjs(friendA.following.lastActive).tz(
          userTimeZone
        );
        const lastActiveB = dayjs(friendB.following.lastActive).tz(
          userTimeZone
        ) as dayjs.Dayjs;
        return lastActiveB.isAfter(lastActiveA) ? 1 : -1; // Sort in descending order of activity
      } else if (statusExpirationA.isAfter(currentTimeInUserTZ)) {
        return -1; // Friend A has an active status, but B doesn't
      } else if (statusExpirationB.isAfter(currentTimeInUserTZ)) {
        return 1; // Friend B has an active status, but A doesn't
      }
    }

    // If no active statuses, or both have expired statuses, sort by activity
    const lastActiveA = dayjs(friendA.following.lastActive).tz(userTimeZone);
    const lastActiveB = dayjs(friendB.following.lastActive).tz(
      userTimeZone
    ) as dayjs.Dayjs;
    return lastActiveB.isAfter(lastActiveA) ? 1 : -1; // Sort in descending order of activity
  });
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

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["email"]);
    const user: any = await prisma.user.findFirstOrThrow({
      where: {
        email: req.query.email,
      },
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
            AND: [
              { following: { email: req.query.email } },
              { accepted: true },
            ],
          },
          {
            AND: [{ follower: { email: req.query.email } }, { accepted: true }],
          },
        ],
      },
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

    res.json({
      user,
      friends: sortFriendsByStatusAndActivity(
        removeDuplicateFriends(friends),
        "America/Los_Angeles"
      ),
    });
  } catch (e: any) {
    console.log(e);
    res.status(401).json({ error: e.message });
  }
}
