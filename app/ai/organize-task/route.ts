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
      system: `You are an AI which will fill in a task's schema based on its name or any other information provided.
You will provide data in a minified JSON format only, without any surrounding or extra text.
You must follow this schema: [{"title": "...","description": "...","pinned": "true/false"}]
Do not create more than 5 subtasks. You do not have to go up to 5 subtasks. Only create how much is necessary. Keep titles and descriptions to the point. Keep the description to 1 short sentence. You do not need to end the description with a period.
Descriptions need to be short. You can use slashes instead of and/or. Write in the present tense. Do not use any pronouns. If a description is unnecessary, you can leave it empty.
You may use emojis in the name, but do not make it repetitive. You may only use one emoji per name and must keep it in the start. Put a space after an emoji. Try not to repeat emojis
Additional information can sometimes be specified in the prompt. This can include task notes, dates, or other relevant information. It can also be empty.
You must give a minified JSON output, removing unnecessary whitespace. Here is an example:
[{"title":"📈 Practice problems","description":"Complete a selection of practice problems from the textbook"},{"title": 🧮 Old exams","description":"Review previous exams/quizzes"}]
`,
      prompt: `
# Task name
${params.task.name}

# Additional information
## Note
${params.task.note || "Not specified"}

## Label name
${params.task.label?.name || "Not specified"}
`,
    });

    console.log(text);

    return Response.json(JSON.parse(text));
  } catch (e) {
    return handleApiError(e);
  }
}

