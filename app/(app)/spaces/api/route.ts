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
    const propertyId = req.nextUrl.searchParams.get("propertyId");
    if (!propertyId) throw new Error("Missing parameters");

    const space = await prisma.session.findFirstOrThrow({
      where: { id: sessionToken },
      select: {
        user: {
          select: {
            properties: {
              where: { propertyId },
              include: { profile: true },
              take: 1,
            },
          },
        },
      },
    });

    return Response.json(space.user.properties[0]);
  } catch (e) {
    return handleApiError(e);
  }
}
