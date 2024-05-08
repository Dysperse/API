import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
const twofactor = require("node-2fa");

export const dynamic = "force-dynamic";

export const OPTIONS = async (request: NextRequest) => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        email: true,
        profile: { select: { name: true } },
      },
    });
    const data = twofactor.generateSecret({
      name: "Dysperse",
      account: `${user?.profile?.name}`,
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "secret", required: true },
      { name: "code", required: true },
    ]);
    if (!twofactor.verifyToken(params.secret, params.code)) {
      throw new Error("Invalid code");
    }
    const data = await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: params.secret },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const data = await prisma.user.update({
      where: { id: userId },
      data: { twoFactorSecret: null },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
