import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import ical from "ical-generator";
import { NextRequest } from "next/server";

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
      where: { spaceId: params.id },
      select: { user: { select: { email: true } } },
    });
    const entities = await prisma?.entity.findMany({
      where: {
        AND: [{ spaceId: params.id }, { start: { not: Prisma.AnyNull } }],
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
          entity.attachments.map((attachment) => attachment),
        priority: entity.pinned ? 1 : 0,
        url: entity.published
          ? `https://dys.us.to/${entity.shortId}`
          : undefined,
        summary: entity.name,
        description: entity.note,
      });
    }
    return new Response(params.id);
  } catch (e) {
    return handleApiError(e);
  }
}
