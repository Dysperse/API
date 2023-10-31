import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";
import { calculateOverlappingAvailability } from "./calculateOverlappingAvailability";

export async function GET(req: NextRequest) {
  try {
    const id = getApiParam(req, "id", true);

    let data: any = await prisma.event.findFirstOrThrow({
      where: { id },
      select: {
        startDate: true,
        endDate: true,
        timeZone: true,
        participants: {
          include: {
            user: {
              select: {
                name: true,
                email: true,
                color: true,
                Profile: {
                  select: {
                    picture: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Remove participants who have not responded
    data.participants = data.participants.filter(
      (participant) => participant.availability.length > 0
    );

    // Each participant has an array of availability objects. Availability format: { date: "[ISO STRING]", hour: number }
    // Calculate the best date and time to meet based on overlapping availability. If there is no overlap between all people, return null

    const overlappingAvailability = calculateOverlappingAvailability(
      data.participants
    ).sort((a, b) => {
      return b.overlappingParticipants - a.overlappingParticipants;
    });

    return Response.json({
      overlappingAvailability,
      data,
    });
  } catch (e) {
    handleApiError(e);
  }
}
