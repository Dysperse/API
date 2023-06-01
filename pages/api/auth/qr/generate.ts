import { prisma } from "@/lib/server/prisma";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export default async function handler(req, res) {
  const data = await prisma.qrToken.create({
    data: {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  res.json(data);
}
