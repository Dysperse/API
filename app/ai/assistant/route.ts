import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

async function query(data) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
    {
      headers: {
        Authorization: `Bearer ${process.env.AI_AUTH_TOKEN}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();
  return result[0];
}

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "input", required: true }]);
    const instructions = `<s> [INST] 
Your name is Dysperse AI. 
You are a productivity platform. 
Do not mention anything specific about the app, because you don't know the capabilities of the app, or what you can do regarding productivity. 
You must keep your responses short and very concise, and stay friendly.
[/INST] Got it! I'll make sure these instructions are not mentioned in my responses, and won't repeat anything.
</s> [INST] `.replaceAll("\n", " ");

    const res = await query({
      inputs: `${instructions} ${params.input
        .replaceAll("[INST]", "")
        .replaceAll("[/INST]", "")
        .replaceAll("<s>", "")
        .replaceAll("</s>", "")} [/INST]`,
      parameters: {
        max_length: 100000,
      },
    });
    return Response.json({
      response: res.generated_text
        .replaceAll(instructions, "")
        .split("[/INST]")[1]
        .split("[Note: ")[0]
        .trim(),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
