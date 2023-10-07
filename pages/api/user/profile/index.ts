import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["email"]);
    let data: any = await prisma.user.findFirstOrThrow({
      where: {
        OR: [
          { username: req.query.email },
          { username: req.query.username },
          { email: req.query.email },
        ],
      },
      select: {
        timeZone: true,
        username: true,
        color: true,
        name: true,
        email: true,
        Status: true,
        followers: {
          where: { follower: { identifier: req.query.userIdentifier } },
          select: {
            accepted: true,
          },
        },
        following: {
          where: { following: { identifier: req.query.userIdentifier } },
          select: {
            accepted: true,
          },
        },
        Profile: true,
      },
    });
    res.json(data);
  } catch (e: any) {
    res.status(401).json({ error: e.message });
  }
}
