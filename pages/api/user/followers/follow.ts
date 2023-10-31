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
      update: {
        accepted: false,
      },
      create: {
        follower: { connect: { email: followerEmail } },
        following: { connect: { email: victim.email } },
      },
    });
    return Response.json({ success: true });
  } catch ({ message: error }: any) {
    res.status(500).json({ error });
  }
}
