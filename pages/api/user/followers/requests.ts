import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["email"]);
    const data = await prisma.follows.findMany({
      where: {
        AND: [{ accepted: false }, { followingId: req.query.email }],
      },
      include: {
        follower: req.query.basic
          ? undefined
          : {
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
    res.json(data);
  } catch ({ message: error }: any) {
    console.log(error);
    res.status(401).json({ error });
  }
}
