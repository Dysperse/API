import { prisma } from "@/lib/server/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

function handleApiError(error: any) {
  console.error(error);
  return Response.json({
    error: error?.message,
    status: 500,
  });
}

function getSessionToken() {
  const token = headers().get("Authorization")?.replace("Bearer ", "");
  if (!token) throw new Error("Missing `Authorization` header");
  return token;
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const id = req.nextUrl.searchParams.get("id");

    const space = await prisma.session.findFirstOrThrow({
      where: { id: sessionToken },
      select: {
        user: {
          select: {
            properties: true,
          },
        },
      },
    });

    return Response.json(space);
  } catch (e) {
    return handleApiError(e);
  }
}
