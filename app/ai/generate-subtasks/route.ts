import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import { NextRequest } from "next/server";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "taskName", required: true },
    ]);
    const { userId } = await getIdentifiers();
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const { text, response } = await generateText({
      model: google("gemini-1.5-flash"),
      system:
        `You are an AI which will split this task into smaller, manageable subtasks which are relevant to achieve the task.
You will provide data in a minified JSON format only, without any surrounding or extra text.
You must follow this schema: [{"title": "...", "description": "..."}]
Do not create more than 5 subtasks. Keep titles and descriptions to the point. Keep the description to 1 short sentence. You may use emojis in the description.
Do not use extra whitespace or new lines at all.`.replaceAll("\n", " "),
      prompt: `Task name: ${params.taskName}`,
    });

    return Response.json(JSON.parse(text));
  } catch (e) {
    return handleApiError(e);
  }
}
