import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const id = await getApiParam(req, "id", false);
    const filter = await getApiParam(req, "filter", false);

    //  List all tasks for a board from the column
    const data = await prisma.column.findMany({
      where: {
        board: { id },
      },
      orderBy: { order: "asc" },
      include: {
        tasks: {
          include: {
            subTasks: {
              include: {
                completionInstances: true,
              },
            },
            parentTasks: true,
            completionInstances: true,
            createdBy: {
              select: {
                name: true,
                email: true,
                color: true,
                Profile: {
                  select: { picture: true },
                },
              },
            },
          },
          // Don't select subtasks
          where: {
            parentTasks: {
              none: {
                column: {
                  board: { id },
                },
              },
            },
          },
          orderBy:
            filter === "a-z"
              ? { name: "asc" }
              : filter === "date"
              ? { due: "desc" }
              : filter === "modification"
              ? { lastUpdated: "desc" }
              : filter === "color"
              ? { color: "desc" }
              : filter === "attachment"
              ? { image: "desc" }
              : filter === "completed-at"
              ? { completedAt: "desc" }
              : filter === "notifications"
              ? { notifications: "desc" }
              : filter === "subtasks"
              ? { subTasks: { _count: "desc" } }
              : { pinned: "desc" },
        },
      },
    });

    return Response.json(data);
  } catch (e) {
    handleApiError(e);
  }
}
