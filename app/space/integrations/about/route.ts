import { getApiParams } from "@/lib/getApiParams";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  const params = await getApiParams(req, [{ name: "id", required: false }]);
  const integrations = await fetch(
    "https://app.dysperse.com/integrations.json"
  ).then((res) => res.json());

  return Response.json(
    params.id ? integrations.find((i) => i.slug === params.id) : integrations
  );
}
