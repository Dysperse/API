import {
  getApiParam,
  getIdentifiers,
  getSessionToken,
  handleApiError,
} from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function PUT(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const _selection = await getApiParam(req, "selection", false);
    const color = await getApiParam(req, "color", false);
    const due = await getApiParam(req, "due", false);

    const selection = JSON.parse(_selection);
    let errors = 0;

    for (let i = 0; i < selection.length; i++) {
      try {
        const id = selection[i];

        await prisma.task.updateMany({
          where: { AND: [{ id }, { property: { id: spaceId } }] },
          data: {
            ...(color && { color }),
            ...(due && { due: new Date(due) }),
          },
        });
      } catch {
        errors++;
      }
    }

    return Response.json({ success: true, errors });
  } catch (e) {
    handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const sessionToken = await getSessionToken();
    const { spaceId } = await getIdentifiers(sessionToken);
    const _selection = await getApiParam(req, "selection", false);

    const selection = JSON.parse(_selection);
    let errors = 0;

    for (let i = 0; i < selection.length; i++) {
      try {
        const id = selection[i];

        await prisma.task.deleteMany({
          where: {
            AND: [{ propertyId: spaceId }, { parentTasks: { some: { id } } }],
          },
        });

        await prisma.task.delete({ where: { id } });
      } catch {
        errors++;
      }
    }

    return Response.json({ success: true, errors });
  } catch (e) {
    return handleApiError(e);
  }
}
