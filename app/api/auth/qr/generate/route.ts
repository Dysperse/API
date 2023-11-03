import { prisma } from "@/lib/server/prisma";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function GET(req) {
  const data = await prisma.qrToken.create({
    data: {
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  console.log(data);
  return Response.json(data);
}
