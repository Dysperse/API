import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const data = await prisma.event.findMany({
      where: {
        user: { identifier: userIdentifier },
      },
      include: {
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
      orderBy: {
        createdAt: "desc",
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);
    const id = getApiParam(req, "id", true);

    const name = getApiParam(req, "name", false);
    const description = getApiParam(req, "description", false);
    const startDate = getApiParam(req, "startDate", false);
    const endDate = getApiParam(req, "endDate", false);
    const excludingDates = getApiParam(req, "excludingDates", false);
    const location = getApiParam(req, "location", false);

    const event = await prisma.event.findFirstOrThrow({
      where: {
        AND: [{ id }, { user: { identifier: userIdentifier } }],
      },
    });

    const data = await prisma.event.update({
      where: {
        id: event.id,
      },
      data: {
        name,
        description,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        excludingDates: JSON.parse(excludingDates),
        location,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);
    const id = getApiParam(req, "id", true);

    const { id: _id } = await prisma.event.findFirstOrThrow({
      where: {
        AND: [{ user: { identifier: userIdentifier } }, { id }],
      },
    });

    await prisma.eventParticipant.deleteMany({
      where: { eventId: _id },
    });

    const data = await prisma.event.delete({
      where: { id: _id },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = getSessionToken();
    const { userIdentifier } = await getIdentifiers(sessionToken);

    const name = getApiParam(req, "name", false);
    const description = getApiParam(req, "description", false);
    const startDate = getApiParam(req, "startDate", false);
    const endDate = getApiParam(req, "endDate", false);
    const excludingDates = getApiParam(req, "excludingDates", false);
    const excludingHours = getApiParam(req, "excludingHours", false);
    const timeZone = getApiParam(req, "timeZone", false);
    const location = getApiParam(req, "location", false);

    const data = await prisma.event.create({
      data: {
        name,
        description,
        location,
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        timeZone: timeZone,
        excludingDates: JSON.parse(excludingDates),
        excludingHours: JSON.parse(excludingHours),
        user: { connect: { identifier: userIdentifier } },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
