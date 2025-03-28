import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
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
    incrementUserInsight(userId, "aiFeaturesUsed");

    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an AI which will create descriptions for tasks based on its name and other information. 
Generate a detailed task description based on the provided task name.
The description should clearly outline the purpose of the task, key actions required to complete it. 
Use a concise, and casual tone, ensuring clarity and relevance to the task name, while also making the task easy to understand.
The user will read this as a note. Do not just repeat the task name or existing note. Only write how much is necessary.
Keep it concise. You may use bullet points for showing what the user could do, any potential mistakes the user can avoid, or subtle reminders.
If applicable, include examples or scenarios to provide context. You may use emojis within your description.
Additional information can sometimes be specified in the prompt. This can include task notes, dates, or other relevant information. It can also be empty.
You will only give the task's description, without any surrounding text or information.
`,
      prompt: `
# Task name
${params.task.name}

# Additional information
## Existing note
${params.task.note || "Not specified"}

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

