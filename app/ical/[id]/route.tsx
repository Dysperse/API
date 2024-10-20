import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ical from "ical-generator";
import { NextRequest } from "next/server";
import { RRule } from "rrule";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest, { params }) {
  try {
    if (!params.id) throw new Error("Missing id");
    const user = await prisma?.spaceInvite.findFirstOrThrow({
      where: { id: params.id },
      select: { user: { select: { email: true } }, spaceId: true },
    });
    const entities = await prisma?.entity.findMany({
      where: {
        AND: [
          { spaceId: user?.spaceId },
          {
            OR: [
              { start: { not: null } },
              { recurrenceRule: { not: Prisma.AnyNull } },
            ],
          },
        ],
      },
    });

    const calendar = ical({
      name: `${user?.user?.email}'s Dysperse calendar`,
      description: "Tasks and events from Dysperse",
      timezone: "UTC",
    });
    for (const entity of entities) {
      calendar.createEvent({
        end: entity.end,
        start: entity.start as Date,
        allDay: entity.dateOnly,
        attachments:
          entity.attachments &&
          (entity.attachments as any).map((attachment) => attachment),
        priority: entity.pinned ? 1 : 0,
        url: entity.published
          ? `https://dys.us.to/${entity.shortId}`
          : undefined,
        summary: entity.name,
        // location:
        //   entity.attachments &&
        //   (entity.attachments as any).find((e) => e.type === "LOCATION")
        //     ? (entity.attachments as any).find((e) => e.type === "LOCATION")
        //         .data
        //     : undefined,
        repeating: entity.recurrenceRule
          ? new RRule(entity.recurrenceRule as any).toString()
          : undefined,
        description: entity.note,
      });
    }
    return new Response(calendar.toString(), {
      status: 200,
      // headers: {
      //   "Content-Type": "text/calendar",
      //   "Content-Disposition": `attachment; filename="${user?.user?.email}.ics"`,
      // },
    });
  } catch (e) {
    return handleApiError(e);
  }
}
