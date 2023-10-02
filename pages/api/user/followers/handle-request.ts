import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    validateParams(req.query, ["email", "userEmail"]);
    await prisma.user.findFirstOrThrow({
      where: {
        identifier: req.query.userIdentifier,
      },
    });
    if (req.query.action === "true") {
      await prisma.follows.update({
        where: {
          followerId_followingId: {
            followerId: req.query.email,
            followingId: req.query.userEmail,
          },
        },
        data: {
          accepted: true,
        },
      });
    } else {
      await prisma.follows.delete({
        where: {
          followerId_followingId: {
            followerId: req.query.email,
            followingId: req.query.userEmail,
          },
        },
      });
    }
    res.json({ success: true });
  } catch ({ message: error }: any) {
    console.log(error);
    res.status(401).json({ error });
  }
}
