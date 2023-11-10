import { DispatchNotification } from "@/lib/server/notification";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const _subscriptions = await prisma.notificationSettings.findMany({
    where: {
      planDay: true,
    },
    include: { user: { select: { email: true, timeZone: true } } },
  });

  const subscriptions = _subscriptions
    .filter((e) => e.pushSubscription)
    .filter((user) => {
      if (
        process.env.NODE_ENV !== "production" &&
        user.user.email !== "manusvathgurudath@gmail.com"
      ) {
        return false;
      } else {
        return true;
      }
    });
  const prompts = [
    "What will you do to make your day impactful?",
    "What are your top three goals for today!?",
    "Let's plan your day!",
    "How will you manage and prioritize your time efficiently today?",
  ];

  for (const subscription of subscriptions) {
    await DispatchNotification({
      actions: [{ action: "plan", title: "👉 Let's go" }],
      subscription: JSON.stringify(subscription.pushSubscription),
      title: "Good morning!",
      body: prompts[Math.floor(Math.random() * prompts.length)],
    });
  }

  return Response.json({ success: true, subscriptions: subscriptions });
}
