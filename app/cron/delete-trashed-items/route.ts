import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  )
    throw new Error("Access denied");

  await prisma.entity.deleteMany({
    where: {
      trash: true,
    },
  });

  return Response.json({ success: true });
}
