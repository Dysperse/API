import { prisma } from "@/lib/server/prisma";

export default async function handler(req, res) {
  const data = await prisma.propertyInvite.findMany({
    include: {
      profile: true,
    },
    where: {
      AND: [
        {
          user: {
            is: {
              identifier: req.query.userIdentifier || "null",
            },
          },
        },
        { selected: false },
      ],
    },
  });
  return Response.json(data);
}
