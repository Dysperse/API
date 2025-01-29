import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
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
    incrementUserInsight(userId, "aiFeaturesUsed");
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    const labels = await prisma.label.findMany({
      where: { userId },
    });

    const { text } = await generateText({
      model: google("gemini-1.5-flash"),
      // prettier-ignore
      system: `
# Instructions and format
YoYou will provide data in a minified JSON format only, without any surrounding or extra text. You must stick to the schema provided below. Remove unnecessary whitespace.
Additional information can sometimes be specified in the prompt. This can include task notes, dates, or other relevant information. It can also be empty.

# Helpful information
The current date and time is ${dayjs().utc().toISOString()}. It is provided in the ISO 8601 format, in the UTC timezone.

# Schema
{"n":string,"d":string,"s": 2|4|8|16|32,"p":boolean,"l":"string","t":"ISO 8601 date","e":"ISO 8601 date",y:boolean}[]
- n: The name of the task. Begin it with a non-repeating emoji. Sentence must be an actionable item and start with a capital letter.
- d: The description of the task (Optional, only fill if additional notes might be helpful. Do not go over 1-2 sentences).
- s: This is how complex the task is. Choose from 2, 4, 8, 16, or 32. Decide how much effort is required to complete the task.
- p: Whether the task should be pinned or not. Choose from true or false. A pinned task is one that is important and should be completed first. Imporant tasks are usually time-sensitive or have a high priority.
- l: The ID of the label that the task should be categorized under.
- t: The start date of the task. This is an optional field. Always use UTC timezone.
- e: The end date of the task. This is an optional field. Always use UTC timezone.
- y: Is the task all day? If a time is not specified, it is considered an all-day task. Choose from true or false.

# Example
## Input 
### Text
Welcome to John Doe's Physics class. This semester, we will be covering a variety of topics, including motion, forces, and energy. The first assignment is due on 2022-12-31. The final exam will be on 2023-05-31. The textbook for this class is "Physics for Dummies". The class will be held on Mondays and Wednesdays from 10:00 AM to 11:30 AM. The class will be held in room 101. 

### Available labels:
Label ID: 1, Name: "math"
Label ID: 2, Name: "science"
Label ID: 3, Name: "english"

### Output
[{"n":"📖 Read Physics for Dummies","d":"Read the first chapter of the textbook","s":2,"p":false,"l":"2","t":"2022-12-31T00:00:00Z","e":"2022-12-31T23:59:59Z","y":false},{"n":"🎢 Study motion","d":"","s":8,"p":true,"l":"2","t":"2023-05-31T00:00:00Z","e":"2023-05-31T23:59:59Z","y":false},{"n":"🫸 Study forces","d":"","s":8,"p":true,"l":"2","t":"2023-05-31T00:00:00Z","e":"2023-05-31T23:59:59Z","y":false},{"n":"⚡ Study energy","d":"","s":8,"p":true,"l":"2","t":"2023-05-31T00:00:00Z","e":"2023-05-31T23:59:59Z","y":false},{"n":"💯 Take the final exam","d":"","s":16,"p":true,"l":"2","t":"2023-05-31T00:00:00Z","e":"2023-05-31T23:59:59Z","y":false}]
`,
      prompt: `
# Available labels: 
${labels.map((e) => `Label ID: ${e.id}, Name: ${e.name}`).join("\n")}

# Text
${params.text}
`,
    });
    console.log(text);
    return Response.json(
      JSON.parse(text).map((task) => ({
        name: task.n,
        description: task.d,
        storyPoints: task.s,
        pinned: task.p,
        labelId: task.l,
        start: task.t,
        end: task.e,
        dateOnly: task.y,
      }))
    );
  } catch (e) {
    return handleApiError(e);
  }
}

