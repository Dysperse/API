import { prisma } from "@/lib/server/prisma";

/**
 * API handler for the /api/user/info endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=10, stale-while-revalidate=59"
  );

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
        {
          selected: false,
        },
      ],
    },
  });
  res.json(data);
}
