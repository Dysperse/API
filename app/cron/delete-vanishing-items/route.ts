import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
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

  const d = await prisma.entity.deleteMany({
    where: {
      AND: [
        {
          space: { members: { every: { user: { vanishMode: true } } } },
        },
        {
          start: { lte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) },
        },
        {
          recurrenceRule: { equals: Prisma.AnyNull },
        },
        {
          // completionInstances is not empty
          completionInstances: { some: {} },
        },
      ],
    },
  });

  return Response.json({ success: true, deleted: d.count });
}
