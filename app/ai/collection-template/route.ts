import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";

dayjs.extend(utc);

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "text", required: true }], {
      type: "BODY",
    });
    const { userId } = await getIdentifiers();
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      // prettier-ignore
      system: `
# Instructions and format
You are an AI which will bring a user's ideas to life by converting what they need to a collection. Think of a collection as a kanban board, with labels where tasks can be categorized. Collections can be then viewed in different ways.
You will provide data in a minified JSON format only, without any surrounding or extra text. You must stick to the schema provided below. Remove unnecessary whitespace.

# Schema
{
    "name": string,
    "description": string,
    "emoji": "unicode hex code",
    "defaultView: list | kanban | grid | skyline |  planner | stream | calendar | workload | matrix,
    "category": "work" | "personal" | "shopping" | "study",
    "labels": {
      "name": string,
      "color": red | orange | yellow | green | blue | purple | pink | brown,
      "emoji": "unicode hex code"
    }[],
}

- name: The name of the collection.
- description: The description of the collection. 
- emoji: The emoji to represent the collection. This must be a unicode hex code. Do not include the leading text.
- defaultView: The default view of the collection. Choose from list, kanban, grid, skyline, planner, stream, calendar, workload, or matrix.
      - list: A simple list view.
      - kanban: A kanban board view.
      - grid: Similar to kanban, but with a grid layout.
      - skyline: Similar to planner, but one column is for today's tasks, one is for the week's tasks, one is for the month's tasks, and one is for the year's tasks.
      - planner: A traditional planner view.
      - stream: View upcoming, backlog, and completed tasks side by side in columns
      - calendar: A traditional calendar view.
      - workload: View tasks by how much effort they require.
      - matrix: Eisenhower matrix view.
- category: The category of the collection. Choose from work, personal, shopping, or study.
- labels: The labels that can be used to categorize tasks in the collection. Each label has a name, color, and description.
      - name: The name of the label.
      - color: The color of the label. Choose from red, orange, yellow, green, blue, purple, pink, or brown.
      - emoji: The emoji to represent the label. This must be a unicode hex code. Do not include the leading text.

# Information
"lock in" can mean to ready and prepare onself or be committed.
Avoid creating labels such as "to-do/in progress/completed". Instead, use labels that represent the type of task.
Labels should be broad and not too specific. A collection should have labels which fit all aspects of the prompt. For example a prompt "summer vacation" should have labels such as "Destination research", "Activities", "Food",  etc.
Only create columns which are necessary for the collection. Do not create extra columns.
Never repeat emojis. Labels should usually be one word. If two words is needed, only the first word should be capitalized.

# Example
## Input 
I want a system to organize my assignments for each class

### Output

{
    "name": "My assignments",
    "description": "A place to organize my assignments for each class",
    "emoji": "1F4DA",
    "defaultView": "kanban",
    "category": "study",
    "labels": [
        {
            "name": "Math",
            "color": "blue",
            "emoji": "1F522"
        },
        {
            "name": "Science",
            "color": "green",
            "emoji": "1F52C"
        },
        {
            "name": "English",
            "color": "orange",
            "emoji": "1F4D6"
        }
    ]
}
`,
      prompt: params.text,
    });

    return Response.json(JSON.parse(text));
  } catch (e) {
    return handleApiError(e);
  }
}
