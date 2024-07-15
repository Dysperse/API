import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { Notification } from "../../../../lib/notifications";

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

    const subscriptions = await prisma.notificationSubscription.findMany({
      where: { userId },
    });

    for (const subscription of subscriptions) {
      new Notification("FORCE", {
        title: "well, hello there 👋",
        body: "#dysperse notifications are cool — and so are you! 🤭",
        data: { someData: "goes here" },
      }).send(subscription);
    }

    return Response.json(subscriptions);
  } catch (e) {
    return handleApiError(e);
  }
}
