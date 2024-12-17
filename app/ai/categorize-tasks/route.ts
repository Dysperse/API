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
    const labels = await prisma.label.findMany({
      where: {
        AND: [
          { userId },
          params.task.collectionId && {
            collections: { some: { id: params.task.collectionId } },
          },
        ].filter((e) => e),
      },
    });

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
{"storyPoints":2|4|8|16|32,"pinned":boolean,"labelId":string,"storyPointReason":string}
- storyPoints: This is how complex the task is. Choose from 2, 4, 8, 16, or 32. Decide how much effort is required to complete the task.
- pinned: Whether the task should be pinned or not. Choose from true or false. A pinned task is one that is important and should be completed first. Imporant tasks are usually time-sensitive or have a high priority.
- labelId: The ID of the label that the task should be categorized under.
- storyPointReason: This is a string that explains why the task has the number of story points it does. This is a reason for why you chose the number of story points you did. Keep it one sentence long. Don't assume everything. You can explain why a task is complex or simple.

# Example
## Input 
### Name
Study for math final

### Available labels:
Label ID: 1, Name: "math"
Label ID: 2, Name: "science"
Label ID: 3, Name: "english"

### Output
{"storyPoints":16,"pinned":true,"labelId":1,"storyPointReason":"This is a final exam and might require a lot of effort to study for."}
`,
      prompt: `
# Available labels: 
${labels.map((e) => `Label ID: ${e.id}, Name: ${e.name}`).join("\n")}

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

    return Response.json({
      ...JSON.parse(text),
      label: labels.find((e) => e.id === JSON.parse(text).labelId),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
