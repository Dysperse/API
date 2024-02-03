import { getApiParams } from "@/lib/getApiParams";
import { NextRequest } from "next/server";
import integrations from "./integrations.json";

export async function GET(req: NextRequest) {
  const params = await getApiParams(req, [{ name: "id", required: false }]);

  return Response.json(
    params.id ? integrations.find((i) => i.slug === params.id) : integrations
  );
}
