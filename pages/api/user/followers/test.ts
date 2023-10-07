import { prisma } from "@/lib/server/prisma";

const y = "26ghanimusa@iusd.org";
const x = "manusvathgurudath@gmail.com";

export default async function handler(req, res) {
  try {
    const data = await prisma.follows.update({
      where: {
        followerId_followingId: {
          followerId: y,
          followingId: x,
        },
      },
      data: {
        follower: { connect: { email: x } },
        following: { connect: { email: y } },
      },
    });
    res.json(data);
  } catch ({ message: error }: any) {
    console.log(error);
    res.status(401).json({ error });
  }
}
