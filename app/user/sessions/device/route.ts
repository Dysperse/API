import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "ip", required: true }]);
    const res = await fetch(`http://ip-api.com/json/${params.ip}`, {
      method: "GET",
    }).then((res) => res.json());

    return Response.json({
      ...res,
      preview: `https://cache.ip-api.com/${res.lon},${res.lat},10`,
    });
  } catch (e) {
    return handleApiError(e);
  }
}
