import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "ip", required: true }]);
    const res = await fetch(
      `https://api.findip.net/${params.ip}/?token=${process.env.IP_API_TOKEN}`,
      {
        method: "GET",
      }
    ).then((res) => res.json());

    return Response.json({
      ...res,
      preview: `https://cache.ip-api.com/${res.location.longitude},${res.location.latitude},10`,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
