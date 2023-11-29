export function calculateOverlappingAvailability(participants) {
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
          overlappingParticipants: 1,
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
