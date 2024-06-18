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

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "type", required: true },
        { name: "tokens", required: true },
      ],
      { type: "BODY" }
    );

    const subscription = await prisma.notificationSubscription.create({
      data: {
        user: { connect: { id: userId } },
        type: params.type,
        tokens: params.tokens,
      },
    });

    return Response.json({ subscription });
  } catch (e) {
    return handleApiError(e);
  }
}
