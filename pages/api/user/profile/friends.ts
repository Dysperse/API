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
        following: {
          email: req.query.email,
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
