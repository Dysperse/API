import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["followerEmail", "followingEmail"]);
    const { followerEmail, followingEmail }: any = req.query;

    const follower = await prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: followingEmail }, { username: followingEmail }],
      },
      select: {
        email: true,
      },
    });

    await prisma.follows.upsert({
      where: {
        followerId_followingId: {
          followerId: followerEmail,
          followingId: follower.email,
        },
      },
      update: {},
      create: {
        follower: { connect: { email: followerEmail } },
        following: { connect: { email: follower.email } },
      },
    });
    res.json({ success: true });
  } catch ({ message: error }: any) {
    res.status(500).json({ error });
  }
}
