import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["followerEmail", "followingEmail"]);
    const { followerEmail, followingEmail }: any = req.query;

    const data = await prisma.follows.upsert({
      where: {
        followerId_followingId: {
          followerId: followerEmail,
          followingId: followingEmail,
        },
      },
      update: {},
      create: {
        follower: { connect: { email: followerEmail } },
        following: { connect: { email: followingEmail } },
      },
    });
    res.json(data);
  } catch ({ message: error }: any) {
    res.status(401).json({ error });
  }
}
