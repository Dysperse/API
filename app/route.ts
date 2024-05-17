import dayjs from "dayjs";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET() {
  return Response.json({
    success: true,
    timezone: "UTC",
    timestamp: dayjs().utc().toISOString(),
  });
}
