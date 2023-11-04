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

    const id = await getApiParam(req, "id", true);
    const isCompleted = await getApiParam(req, "isCompleted", true);
    const completedAt = await getApiParam(req, "completedAt", true);
    const iteration = await getApiParam(req, "iteration", false);

    if (isCompleted === "true") {
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
