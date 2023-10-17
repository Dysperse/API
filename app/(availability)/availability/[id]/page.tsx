import { prisma } from "@/lib/server/prisma";
import { AvailabilityPage } from "./AvailabilityPage";

export default async function Page({ params }) {
  const eventData = await getEventData(params.id);
  return <AvailabilityPage eventData={eventData} />;
}

export async function getEventData(id) {
  console.log("event id:" + id);

  try {
    const data = await prisma.event.findFirstOrThrow({
      where: { id },
    });
    console.log(data);
    return data;
  } catch (e: any) {
    return e;
  }
}
