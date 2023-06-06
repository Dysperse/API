import { prisma } from "@/lib/server/prisma";
import { validateParams } from "@/lib/server/validateParams";

export default async function handler(req, res) {
  try {
    const { email, userIdentifier } = req.query;
    validateParams(req.query, ["email", "userIdentifier"]);

    const data = await prisma.profile.deleteMany({
      where: {
        user: {
          AND: [{ email }, { identifier: userIdentifier }],
        },
      },
    });
    res.json(data);
  } catch ({ message: error }: any) {
    res.status(401).json({ error });
  }
}
