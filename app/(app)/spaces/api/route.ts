import { prisma } from "@/lib/server/prisma";
import { headers } from "next/headers";
import { NextRequest } from "next/server";

function handleApiError(error: any) {
  return Response.json({
    error: error?.message,
    status: 500,
  });
}

export async function GET(req: NextRequest) {
  try {
    const sessionToken = headers().get("Authorization");
    const users = await prisma.user.findMany({
      include: {
        properties: {
          select: {
            id: true,
            accepted: true,
          },
        },
      },
    });
    for (const user of users) {
      const property = user.properties.find((p) => p.accepted);
      if (property) {
        await prisma.user.update({
          data: {
            selectedProperty: {
              connect: {
                id: property.id,
              },
            },
          },
          where: {
            id: user.id,
          },
        });
      }
    }
    return Response.json({ sessionToken });
  } catch (e) {
    handleApiError(e);
  }
}
