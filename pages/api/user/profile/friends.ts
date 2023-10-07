import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

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
      friends: removeDuplicateFriends(friends),
    });
  } catch (e: any) {
    console.log(e);
    res.status(401).json({ error: e.message });
  }
}
