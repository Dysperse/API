import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "lat", required: true },
      { name: "long", required: true },
    ]);
    const data = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${params.lat}&longitude=${params.long}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,weather_code,wind_speed_10m&temperature_unit=fahrenheit&wind_speed_unit=mph&precipitation_unit=inch&timezone=America%2FLos_Angeles&forecast_days=1`
    ).then((res) => res.json());
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
