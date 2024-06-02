import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
dayjs.extend(utc);

export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    success: true,
    timezone: "UTC",
    timestamp: dayjs().utc().toISOString(),
  });
}
