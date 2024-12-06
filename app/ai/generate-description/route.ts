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

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "task", required: true }], {
      type: "BODY",
    });
    const { userId } = await getIdentifiers();
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an AI which will create descriptions for tasks based on its name and other information. 
Generate a detailed task description based on the provided task name. The description should clearly outline the purpose of the task, key actions required to complete it, and any specific tools, skills, or resources needed. Use a concise and professional tone, ensuring clarity and relevance to the task name, while also making the task actionable and easy to understand. 
If applicable, include examples or scenarios to provide context. You may use emojis within your description.
Additional information can sometimes be specified in the prompt. This can include task notes, dates, or other relevant information. It can also be empty.
You will only give the task's description, without any surrounding text or information.
`,
      prompt: `
# Task name
${params.task.name}

# Additional information

## Label name
${params.task.label?.name || "Not specified"}
`,
    });

    console.log(text);

    return Response.json(text);
  } catch (e) {
    return handleApiError(e);
  }
}
