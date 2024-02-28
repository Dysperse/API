import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
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

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [{ name: "token", required: true }],
      { type: "QUERY" }
    );

    const data = await prisma.qrToken.findFirstOrThrow({
      where: { token: params.token },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const data = await prisma.qrToken.create({
      data: { expiresAt: dayjs().add(20, "minute").toISOString() },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
