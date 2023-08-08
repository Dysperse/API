import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["followerEmail", "followingEmail"]);

    const { followerEmail, followingEmail }: any = req.query;

    const victim = await prisma.user.findFirstOrThrow({
      where: {
        OR: [{ email: followingEmail }, { username: followingEmail }],
      },
      select: {
        notificationSubscription: true,
        NotificationSettings: {
          select: { followerUpdates: true },
        },
        email: true,
      },
    });

    if (
      victim.notificationSubscription &&
      victim.notificationSubscription.followerUpdates
    ) {
      try {
        await DispatchNotification({
          subscription: victim.notificationSubscription,
          title: "You have a new follower!",
          body: "Tap to view profile",
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
      update: {},
      create: {
        follower: { connect: { email: followerEmail } },
        following: { connect: { email: victim.email } },
      },
    });
    res.json({ success: true });
  } catch ({ message: error }: any) {
    res.status(500).json({ error });
  }
}
