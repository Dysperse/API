import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async (request: NextRequest) => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

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

    return new Response(
      `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Jost:ital,wght@0,100..900;1,100..900&family=Space+Grotesk:wght@300&display=swap" rel="stylesheet">
        <title>QR Code</title>
        <style>
          body {
            box-sizing: border-box;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background-color: #f0f0f0;
            font-family: Jost, sans-serif;
            font-size: 1.2rem;
            padding: 20px;
            text-align: center;
            flex-direction: column;
            gap: 20px;
          }
        </style>
      </head>
      <body>
      <img src="https://dysperse.com/favicon.ico" alt="Logo" width="70" height="70" />
       Download and open the Dysperse app to scan the QR code. <br /> You can find this by navigating to Settings > Account > Scan QR Code.
      </body>
    </html>
    `,
      { headers: { "content-type": "text/html" } }
    );
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
