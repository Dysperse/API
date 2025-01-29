import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    incrementUserInsight(userId, "aiFeaturesUsed");
    // take it - i don't care, it's a free api anyways
    // huggingface scans for leaked tokens and revokes them.
    return Response.json(process.env.IMAGE_CAPTIONING_TOKEN);
  } catch (e) {
    return handleApiError({ error: "Please log in" });
  }
}
