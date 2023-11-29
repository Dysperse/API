import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const eventId = await getApiParam(req, "eventId", true);
    const isAuthenticated = await getApiParam(req, "isAuthenticated", false);
    const email = await getApiParam(req, "email", false);
    const userData = await getApiParam(req, "userData", false);
    const data = await prisma.eventParticipant.create({
      data: {
        event: { connect: { id: eventId } },
        ...(isAuthenticated === "true"
          ? { user: { connect: { email } } }
          : { userData: JSON.parse(userData) }),
        availability: [],
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function GET(req: NextRequest) {
  try {
    const id = await getApiParam(req, "id", true);
    const basic = await getApiParam(req, "basic", false);

    const data = await prisma.event.findFirstOrThrow({
      where: { id },
      include: {
        ...(!basic && {
          participants: {
            select: {
              id: true,
              availability: true,
              userData: true,
              user: {
                select: {
                  name: true,
                  email: true,
                  Profile: { select: { picture: true } },
                },
              },
            },
          },
        }),
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
