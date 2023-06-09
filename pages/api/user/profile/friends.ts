import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["email"]);
    const user: any = await prisma.user.findFirstOrThrow({
      where: {
        email: req.query.email,
      },
      select: {
        name: true,
        email: true,
        Profile: true,
      },
    });

    const friends: any = await prisma.follows.findMany({
      where: {
        follower: {
          email: req.query.email,
        },
      },
      include: {
        following: {
          select: {
            name: true,
            email: true,
            color: true,
            CoachData: {
              select: {
                streakCount: true,
              },
            },
            properties: {
              select: {
                profile: {
                  select: {
                    Task: {
                      select: { due: true },
                      where: {
                        AND: [
                          { completed: false },
                          { due: { gte: new Date(req.query.date) } },
                        ],
                      },
                      take: 3,
                      orderBy: {
                        due: "asc",
                      },
                    },
                  },
                },
              },
            },
            sessions: {
              orderBy: {
                timestamp: "desc",
              },
              take: 1,
              select: {
                timestamp: true,
              },
            },
            Profile: {
              select: {
                picture: true,
                workingHours: true,
              },
            },
            trophies: true,
          },
        },
      },
    });

    res.json({
      user,
      friends,
    });
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
}
