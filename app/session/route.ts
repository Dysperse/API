import { getIdentifiers } from "@/lib/getIdentifiers";
import { getSessionData } from "@/lib/getSessionData";
import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { sessionId } = await getIdentifiers();
    const user = await getSessionData(sessionId as string);

    return Response.json(user);
  } catch (e) {
    return handleApiError(e);
  }
}
