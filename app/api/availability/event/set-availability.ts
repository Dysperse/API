import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const email = await getApiParam(req, "email", true);
    const eventId = await getApiParam(req, "eventId", true);
    const availability = await getApiParam(req, "availability", true);
    const userData = await getApiParam(req, "userData", false);

    let user: any = {};
    if (email) {
      user = await prisma.eventParticipant.findFirst({
        where: {
          AND: [{ user: { email } }, { event: { id: eventId } }],
        },
      });
    } else {
      const users = await prisma.eventParticipant.findMany({
        where: { event: { id: eventId } },
      });

      user = users.find(
        (u: any) => u.userData?.email === JSON.parse(userData).email
      );
    }

    if (user?.id) {
      const d = await prisma.eventParticipant.update({
        where: {
          id: user?.id,
        },
        data: {
          userData: userData ? JSON.parse(userData) : undefined,
          availability: JSON.parse(availability),
        },
      });
      return Response.json(d);
    } else {
      const d = await prisma.eventParticipant.create({
        data: {
          availability: JSON.parse(availability),
          ...(email
            ? {
                user: { connect: { email } },
              }
            : { userData: JSON.parse(userData) }),
          event: {
            connect: {
              id: eventId,
            },
          },
        },
      });
      return Response.json(d);
    }
  } catch (e) {
    return handleApiError(e);
  }
}
