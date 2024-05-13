import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET() {
  const data = await prisma.entity.findMany({
    where: {
      recurrenceRule: { string_contains: "RRULE" },
    },
  });
  return Response.json(data);
}
