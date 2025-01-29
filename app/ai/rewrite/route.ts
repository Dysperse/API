import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { prisma } from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import markdown from "@wcj/markdown-to-html";
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
    const params = await getApiParams(req, [{ name: "id", required: true }], {
      type: "BODY",
    });
    const { userId } = await getIdentifiers();
    incrementUserInsight(userId, "aiFeaturesUsed");
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({ apiKey: data.token });

    const task = await prisma.entity.findFirstOrThrow({
      where: { id: params.id },
      include: { label: true },
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `You are an AI which will rewrite a task's lengthy description.
The description should clearly outline the purpose of the task, key actions required to complete it. You will not repeat the task name.
Use a concise, and casual tone, ensuring clarity and relevance to the task name, while also making the task easy to understand.
The user will read this as a note and the intent of this feature is so that the user can quickly open a task and see what they need to do without reading a lengthy description.
Only write how much is necessary. Keep it concise. You should use bullet points which start with a non-repeating emoji in plain text (example: 🔥).
Additional information can sometimes be specified in the prompt. This can include task notes, dates, or other relevant information. It can also be empty.
You will only give the task's description, without any surrounding text or information. Format your answer using markdown. 
If there are any links, please keep them as they are. If needed, change the name of the link to a more user-friendly name.
`,
      prompt: `
# Task name
${task.name}

# Additional information
## Existing note
${task.note || "Not specified"}

## Label name
${task.label?.name || "Not specified"}
`,
    });

    return Response.json(markdown(text));
  } catch (e) {
    return handleApiError(e);
  }
}

