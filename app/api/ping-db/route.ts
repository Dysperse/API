import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

/**
 * API handler for the /api/login endpoint
 * @param {any} req
 * @param {any} res
 * @returns {any}
 */
export async function GET(req: NextRequest) {
  await prisma.user.findFirst({ select: { id: true } });
  return Response.json({ success: true });
}
