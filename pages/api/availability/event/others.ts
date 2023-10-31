import { prisma } from "@/lib/server/prisma";

function calculateOverlappingAvailability(participants) {
  // Create a map to store the availability count for each date and hour
  const availabilityMap = new Map();

  // Iterate through participants
  participants.forEach((participant) => {
    participant.availability.forEach((availability) => {
      // Extract date (ignoring time) and hour
      const date = availability.date.split("T")[0];
      const hour = availability.hour;

      // Create a unique key for each date-hour combination
      const key = `${date}-${hour}`;

      // Initialize the count for this date-hour combination if it doesn't exist
      if (!availabilityMap.has(key)) {
        availabilityMap.set(key, {
          date: date,
          hour: hour,
          overlappingParticipants: 1, // Initialize with 1 participant
          participants: [participant],
        });
      } else {
        // Increment the count of overlapping participants for this date-hour combination
        const existingEntry = availabilityMap.get(key);
        existingEntry.overlappingParticipants += 1;
        existingEntry.participants = [
          ...existingEntry.participants,
          participant,
        ];
      }
    });
  });

  // Filter entries to only include those with overlapping participants
  const overlappingAvailability = Array.from(availabilityMap.values()).filter(
    (entry) => true
  );

  return overlappingAvailability;
}

export default async function handler(req, res) {
  try {
    let data: any = await prisma.event.findFirstOrThrow({
      where: { id: req.query.id },
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

    res.json({
      overlappingAvailability,
      data,
    });
  } catch (e) {
    res.status(400).json({ error: true, message: e.message });
  }
}
