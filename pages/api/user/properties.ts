import { prisma } from "../../../lib/prismaClient";

/**
 * API handler for the /api/user/info endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
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
        {
          selected: false,
        },
      ],
    },
  });
  res.json(data);
}
