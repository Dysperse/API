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
    const params = await getApiParams(
      req,
      [
        { name: "task", required: true },
        { name: "labels", required: true },
      ],
      {
        type: "BODY",
      }
    );
    const { userId } = await getIdentifiers();
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `
# Instructions and format
You are an AI which will read a tasks's name and decide the best way to categorize it. 
You will provide data in a minified JSON format only, without any surrounding or extra text. You must stick to the schema provided below. Remove unnecessary whitespace.
Additional information can sometimes be specified in the prompt. This can include task notes, dates, or other relevant information. It can also be empty.

# Schema
{"labelId": "...Label ID..."}
- labelId: the ID of the label

# Example
## Input 
### Name
Study for math final

### Available labels:
Label ID: 1, Name: "math"
Label ID: 2, Name: "science"
Label ID: 3, Name: "english"

### Output
{"labelId":1}
`,
      prompt: `
# Available labels: 
${params.labels.map((e) => `Label ID: ${e.id}, Name: ${e.name}`).join("\n")}

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
