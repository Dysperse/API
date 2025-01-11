import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";

dayjs.extend(utc);

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
        { name: "id", required: false },
        { name: "prompt", required: true },
      ],
      {
        type: "BODY",
      }
    );
    const { userId, spaceId } = await getIdentifiers();
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({
      apiKey: data.token,
    });

    let collection;

    if (params.id)
      collection = await prisma.collection.findFirst({
        where: {
          AND: [{ id: params.id }, { userId }],
        },
        select: {
          name: true,
          entities: {
            select: {
              name: true,
              note: true,
              recurrenceRule: true,
              _count: { select: { completionInstances: true } },
            },
          },
          labels: {
            select: {
              name: true,
              entities: {
                select: {
                  name: true,
                  note: true,
                  recurrenceRule: true,
                  _count: { select: { completionInstances: true } },
                },
              },
            },
          },
        },
      });
    else
      collection = await prisma.entity.findMany({
        where: { spaceId },
        select: {
          name: true,
          note: true,
          recurrenceRule: true,
          _count: { select: { completionInstances: true } },
        },
      });

    const serialized = params.id
      ? JSON.stringify({
          n: collection.name,
          t: collection.entities.map((e) => ({
            n: e.name,
            d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
            c: e._count.completionInstances > 0 && !e.recurrenceRule,
          })),
          l: collection.labels.map((l) => ({
            n: l.name,
            t: l.entities.map((e) => ({
              n: e.name,
              d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
              c: e._count.completionInstances > 0 && !e.recurrenceRule,
            })),
          })),
        })
      : JSON.stringify({
          t: collection.map((e) => ({
            n: e.name,
            d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
            c: e._count.completionInstances > 0 && !e.recurrenceRule,
          })),
        });

    const { text } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      // prettier-ignore
      system: `
# Instructions and format
You are an AI which will answer a user's question based on their kanban board. 
You may answer general questions outside the context of the kanban board.
When a user asks for ideas, do not repeat items already in the board, abd provide a variety of ideas.
When a user asks for an explanation, make sure you give reasoning in another sentence.
Responses should be in a conversational format. Keep them to the point, informational. You may go up to one short paragraph (1-4 sentences).
Do not mention that it is a kanban board. Keep in mind some tasks may be completed, so be aware of this when answering questions.
You do not need to repeat the question in your response, but you should answer it directly.
The input schema is defined below 

# Schema
{
    "n": string,
    "t": {
        "n": string,
        "d"?: string,
        "c"?: boolean
    }[],
   "l": {
        "n": string,
        "t": {
          "n": string,
          "d"?: string
          "c"?: boolean
        }[],
    }[]
}

- n: The name of the collection
- l: The labels in the collection. Each label has a name and a list of tasks
    - n: The name of the label
    - t: The tasks in the label. Each task has a name and a description
        - n: The name of the task
        - d: The description of the task
        - c: Whether the task is completed or not
- t: Uncategorizedtasks in the collection. Each task has a name and a description
    - n: The name of the task
    - d: The description of the task
    - c: Whether the task is completed or not

## Input 
### Collection
${JSON.stringify({
    n: "College list",
    t: [
        { n: "Caltech" },
    ],
    l: [
        {
            n: "Reach",
            t: [
            { n: "Harvard", d: "Top college in the world" },
            { n: "MIT", d: "Top college in the world" },
            ],
        },
        {
            n: "Safety",
            t: [
            { n: "UC Berkeley", d: "Top college in the world" },
            { n: "Stanford", d: "Top college in the world" },
            ],
        },
    ],
})}

### Prompt
Which of these colleges require SAT scores?

### Output
The colleges that require SAT scores are Harvard, MIT, UC Berkeley, and Stanford.
`,
      prompt: `
### Collection
${serialized}

### Prompt
${params.prompt}
`,
    });

    return Response.json({ generated: text });
  } catch (e) {
    return handleApiError(e);
  }
}
