import {
    getApiParam,
    getIdentifiers,
    getSessionToken,
    handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  const sessionToken = await getSessionToken();
  const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);
  const id = getApiParam(req, "id", true);
  const name = getApiParam(req, "name", false);
  const color = getApiParam(req, "color", false);
  const image = getApiParam(req, "image", false);
  const pinned = getApiParam(req, "pinned", false);
  const due = getApiParam(req, "due", false);
  const description = getApiParam(req, "description", false);
  const dateOnly = getApiParam(req, "dateOnly", false);
  const where = getApiParam(req, "where", false);
  const date = getApiParam(req, "date", false);
  const columnId = getApiParam(req, "columnId", false);

  try {
    const data = await prisma.task.updateMany({
      where: {
        AND: [
          { id },
          {
            OR: [
              { createdBy: { identifier: userIdentifier } },
              { propertyId: spaceId },
            ],
          },
        ],
      },
      data: {
        lastUpdated: date,
        ...(name && { name }),
        ...(dateOnly && { dateOnly: dateOnly === "true" }),
        ...(pinned && { pinned: pinned === "true" }),
        ...(columnId && {
          columnId: columnId === "null" ? null : columnId,
        }),

        ...((description || description === "") && {
          description,
        }),
        ...((where || where === "") && {
          where,
        }),

        ...(due &&
          due !== "" && {
            due,
          }),

        ...(due === "" && {
          due: null,
        }),

        ...(color && { color }),

        ...(image && {
          image: image == "null" ? null : image,
        }),
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const id = getApiParam(req, "id", true);
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);

    await prisma.task.deleteMany({
      where: {
        AND: [
          { id },
          {
            OR: [
              { propertyId: spaceId },
              { createdBy: { identifier: userIdentifier } },
            ],
          },
        ],
      },
    });
    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}

export async function POST(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);
    const notifications = getApiParam(req, "notifications", false);
    const title = getApiParam(req, "title", false);
    const color = getApiParam(req, "color", false);
    const image = getApiParam(req, "image", false);
    const pinned = getApiParam(req, "pinned", false);
    const due = getApiParam(req, "due", false);
    const description = getApiParam(req, "description", false);
    const location = getApiParam(req, "location", false);
    const recurrenceRule = getApiParam(req, "recurrenceRule", false);
    const columnId = getApiParam(req, "columnId", false);
    const parent = getApiParam(req, "parent", false);

    const data = await prisma.task.create({
      data: {
        property: {
          connect: { id: spaceId },
        },
        createdBy: {
          connect: { identifier: userIdentifier },
        },
        notifications: JSON.parse(notifications),
        name: title,
        color: color || "grey",
        completed: false,
        ...(image && { image }),
        pinned: pinned === "true",
        due: due !== "false" ? new Date(due) : null,
        description,
        ...(location && { where: location }),
        ...(recurrenceRule && { recurrenceRule }),
        ...(columnId !== "-1" && {
          column: {
            connect: {
              id: columnId,
            },
          },
        }),
        ...(parent && {
          parentTasks: {
            connect: {
              id: parent,
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

export async function GET(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);
    const id = getApiParam(req, "id", true);

    const data = await prisma.task.findFirstOrThrow({
      where: {
        AND: [
          { id },
          {
            OR: [{ propertyId: spaceId }, { userId: userIdentifier }],
          },
        ],
      },
      include: {
        parentTasks: true,
        subTasks: true,
        property: { select: { name: true, id: true } },
        completionInstances: true,
        column: {
          include: {
            board: { select: { id: true, name: true, public: true } },
          },
        },
        createdBy: {
          select: {
            name: true,
            email: true,
            Profile: {
              select: { picture: true },
            },
          },
        },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
