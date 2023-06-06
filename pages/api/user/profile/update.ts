import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    const { email, userIdentifier } = req.query;
    validateParams(req.query, ["email", "userIdentifier"]);

    if (req.query.create) {
      const data = await prisma.profile.create({
        data: {
          user: { connect: { email } },
        },
      });
      res.json(data);
      return;
    }

    const data = await prisma.profile.updateMany({
      where: {
        user: {
          AND: [{ email }, { identifier: userIdentifier }],
        },
      },
      data: {
        ...(req.query.bio && { bio: req.query.bio }),
        ...(req.query.hobbies && { hobbies: JSON.parse(req.query.hobbies) }),
        ...(req.query.birthday && { birthday: new Date(req.query.birthday) }),
      },
    });
    res.json(data);
  } catch ({ message: error }: any) {
    res.status(401).json({ error });
  }
}
