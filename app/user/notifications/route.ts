import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();

    const subscriptions = await prisma.notificationSubscription.findMany({
      where: { userId },
    });

    const settings = await prisma.notificationSettings.findFirstOrThrow({
      where: { userId },
    });

    return Response.json({ subscriptions, settings });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    await prisma.notificationSubscription.deleteMany({
      where: {
        AND: [{ id: params.id }, { userId }],
      },
    });

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "type", required: true },
        { name: "deviceType", required: true },
        { name: "deviceName", required: true },
        { name: "tokens", required: true },
      ],
      { type: "BODY" }
    );

    const subscriptions = await prisma.notificationSubscription.findMany({
      where: { userId },
    });

    const subscriptionExists = subscriptions.find(
      (d) => JSON.stringify(d.tokens) === JSON.stringify(params.tokens)
    );

    if (subscriptionExists) {
      return Response.json({ subscription: subscriptionExists });
    } else {
      const subscription = await prisma.notificationSubscription.create({
        data: {
          user: { connect: { id: userId } },
          type: params.type,
          deviceType: params.deviceType,
          deviceName: params.deviceName,
          tokens: params.tokens,
        },
      });
      return Response.json({ subscription });
    }
  } catch (e) {
    return handleApiError(e);
  }
}
