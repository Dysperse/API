import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const badges = await prisma.notificationSettings.findFirstOrThrow({
      where: { userId },
      select: { badgedCollections: { select: { id: true } } },
    });

    const entities = await prisma.collection.findMany({
      where: { id: { in: badges.badgedCollections.map((t) => t.id) } },
      select: {
        _count: {
          select: {
            entities: {
              where: {
                trash: false,
                parentTaskId: null,
                completionInstances: {
                  none: { taskId: { contains: "-" } },
                },
              },
            },
          },
        },
        labels: {
          select: {
            name: true,
            _count: {
              select: {
                entities: {
                  where: {
                    trash: false,
                    parentTaskId: null,
                    completionInstances: {
                      none: { taskId: { contains: "-" } },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    return Response.json({
      count: entities.reduce((acc, entity) => {
        const labelCount = entity.labels.reduce(
          (labelAcc, label) => labelAcc + label._count.entities,
          0
        );
        return acc + entity._count.entities + labelCount;
      }, 0),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
