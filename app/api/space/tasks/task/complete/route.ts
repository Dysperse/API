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
    const { spaceId, userIdentifier } = await getIdentifiers(sessionToken);

    const id = getApiParam(req, "id", true);
    const isCompleted = getApiParam(req, "isCompleted", false);
    const completedAt = getApiParam(req, "completedAt", false);
    const iteration = getApiParam(req, "iteration", false);

    if (isCompleted) {
      const data = await prisma.completionInstance.create({
        data: {
          completedAt: new Date(completedAt),
          task: { connect: { id } },
          ...(iteration && {
            iteration: new Date(iteration),
          }),
        },
      });
      return Response.json(data);
    } else {
      const data = await prisma.completionInstance.deleteMany({
        where: iteration
          ? {
              AND: [{ taskId: id }, { iteration: new Date(iteration) }],
            }
          : {
              taskId: id,
            },
      });
      return Response.json(data);
    }
  } catch (e) {
    return handleApiError(e);
  }
}
