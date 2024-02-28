import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function PUT(req: NextRequest) {
  try {
    const ip = (req.headers.get("x-forwarded-for") ?? "127.0.0.1").split(
      ","
    )[0];
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "token", required: true },
        { name: "deviceName", required: true },
        { name: "deviceType", required: true },
      ],
      { type: "BODY" }
    );

    const session = await prisma.session.create({
      data: {
        userId,
        deviceName: params.deviceName,
        deviceType: params.deviceType.toString(),
        ip,
      },
    });

    await prisma.qrToken.update({
      where: { token: params.token },
      data: { sessionId: session.id },
    });

    return Response.json({
      success: true,
    });
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
