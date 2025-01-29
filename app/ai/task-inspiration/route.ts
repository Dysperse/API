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
    const params = await getApiParams(
      req,
      [
        { name: "boardId", required: true },
        { name: "labelId", required: true },
      ],
      {
        type: "BODY",
      }
    );
    const { userId } = await getIdentifiers();
    incrementUserInsight(userId, "aiFeaturesUsed");
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const collection = await prisma.collection.findFirstOrThrow({
      where: { AND: [{ userId }, { id: params.boardId }] },
      select: { name: true, labels: { select: { name: true, id: true } } },
    });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      system: `
# Instructions and format
You are an AI which will inspire users by creating starter tasks based on a user's kanban board column.
You will provide data in a minified JSON format only, without any surrounding or extra text. You must stick to the schema provided below. Remove unnecessary whitespace.

Do not be repetitive with the tasks you generate. Make sure to provide a variety of tasks that are relevant to the column name.
Do not start tasks with the same phrasing

# Schema
{"n":string,"d"?:string,"s": 2|4|8|16|32,"p":boolean"}[]
- n: The name of the task. Begin it with a non-repeating emoji. Emojis must have a space afterwards. Depending on what makes sense, sentence must either be an actionable item or an item relevant to the column name.
- d: The description of the task (Optional, only fill if additional notes might be helpful. Do not go over 1-2 sentences).
- s: This is how complex the task is. Choose from 2, 4, 8, 16, or 32. Decide how much effort is required to complete the task.
- p: Whether the task should be pinned or not. Choose from true or false. A pinned task is one that is important and should be completed first. Imporant tasks are usually time-sensitive or have a high priority.

You should provide 7-10 item

# Example
## Input 
### Kanban board name
Camping trip planning

### Column in this board
Supplies, Food, Transportation, Accommodation

### Selected column
Supplies

### Output
${`
[{"n":"🔦 Flashlights", "d": "Make sure to check the batteries!", "s": 4, "p": true,
{"n":"⛺ Tent", "d": "Check for any holes or tears", "s": 8, "p": false},
{"n":"🪑 Chairs", "d": null, "s": 4, "p": false},
{"n":"🍽️ Plates and utensils", "d": null, "s": 4, "p": false},
{"n":"🥤 Water bottles", "d": null, "s": 4, "p": false},
{"n":"🧴 Sunscreen", "d": null, "s": 2, "p": false},
{"n":"🧊 Ice", "d": "Make sure to get the ice cooler!", "s": 2, "p": false}]`
  .replaceAll("\n", "")
  .trim()}`,
      prompt: `
# Kanban board name: ${collection.name}
# Available columns: 
${collection.labels.map((label) => `${label.name}`).join(", ")}
# Selected column: ${
        collection.labels.find((label) => label.id === params.labelId)?.name
      }
`,
    });

    console.log(text);

    return Response.json(
      JSON.parse(text).map((task) => ({
        name: task.n,
        description: task.d,
        storyPoints: task.s,
        pinned: task.p,
        labelId: params.labelId,
      }))
    );
  } catch (e) {
    return handleApiError(e);
  }
}
