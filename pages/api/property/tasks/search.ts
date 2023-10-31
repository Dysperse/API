import { prisma } from "@/lib/server/prisma";
import { validatePermissions } from "@/lib/server/validatePermissions";

export async function GET(req: NextRequest) {
  try {
    await validatePermissions({
      minimum: "read-only",
      credentials: [req.query.property, req.query.accessToken],
    });
    const query = JSON.parse(req.query.query)
      .map((i) => {
        if (typeof i === "string") {
          return {
            name: i,
          };
        } else {
          return i.condition;
        }
      })
      .reduce((acc, obj) => {
        for (const key in obj) {
          acc[key] = obj[key];
        }
        return acc;
      }, {});

    console.log(query);

    const results = await prisma.task.findMany({
      where: {
        AND: [
          query.pinned && { pinned: true },
          query.description && { description: { not: null } },
          query.color && { color: { not: null } },
          query.recurrenceRule && { recurrenceRule: { not: null } },
          query.image && { image: { not: null } },
          query.location && { location: { not: null } },
          query.name && { name: { contains: query.name, mode: "insensitive" } },
          // PERMISSIONS ----------------------
          // Prevent selecting subtasks
          { parentTasks: { none: { property: { id: req.query.property } } } },
          // Make sure that the task is in the property
          { property: { id: req.query.property } },
          {
            OR: [
              { column: null },
              {
                column: {
                  board: {
                    AND: [
                      { public: false },
                      { userId: req.query.userIdentifer },
                    ],
                  },
                },
              },
              {
                column: {
                  board: {
                    AND: [{ public: true }, { propertyId: req.query.property }],
                  },
                },
              },
            ],
          },
        ].filter((e) => e),
      },
      include: {
        completionInstances: true,
        subTasks: { include: { completionInstances: true } },
        parentTasks: true,
        createdBy: {
          select: {
            name: true,
            color: true,
            email: true,
            Profile: {
              select: {
                picture: true,
              },
            },
          },
        },
        column: {
          select: {
            board: {
              select: {
                name: true,
                id: true,
              },
            },
            name: true,
            emoji: true,
          },
        },
      },
    });

    if (query.completed) {
      return Response.json({
        query,
        data: results.filter((e) => e.completionInstances.length > 0),
      });
    } else if (query.completed === false) {
      return Response.json({
        query,
        data: results.filter((e) => e.completionInstances.length === 0),
      });
    }
    return Response.json({ query, data: results });
  } catch (e) {
    console.log(e);
    return handleApiError(e);
  }
}
