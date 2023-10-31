import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const eventId = getApiParam(req, "eventId", true);
    const isAuthenticated = getApiParam(req, "isAuthenticated", false);
    const email = getApiParam(req, "email", false);
    const userData = getApiParam(req, "userData", false);
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
    const id = getApiParam(req, "id", true);
    const basic = getApiParam(req, "basic", false);

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
