import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["email"]);
    const data = await prisma.follows.findMany({
      where: {
        AND: [{ accepted: false }, { followerId: req.query.email }],
      },
      include: {
        following: {
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
    });
    return Response.json(data);
  } catch ({ message: error }: any) {
    res.status(401).json({ error });
  }
}
