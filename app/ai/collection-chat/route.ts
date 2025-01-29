import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { prisma } from "@/lib/prisma";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import * as chrono from "chrono-node";
import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";
import { NodeHtmlMarkdown } from "node-html-markdown";

dayjs.extend(utc);
dayjs.extend(advancedFormat);

export const maxDuration = 60;

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

function parseDateRanges(dateFilter) {
  return dateFilter.map((filter) => {
    let startDate: any = null;
    let endDate: any = null;

    const start = filter.start;
    const end = filter.end;
    const inputText = filter.text;

    // Use Chrono-provided start and end dates if available
    if (start) {
      startDate = dayjs(start.date());
    }

    if (end) {
      endDate = dayjs(end.date());
    }

    // If no end date, infer based on input text
    if (!endDate && start) {
      const impliedStart = dayjs(start.date());

      if (inputText.match(/\b(last week)\b/i)) {
        // "Last week" implies the full prior week (Monday to Sunday)
        startDate = impliedStart.startOf("week").subtract(1, "week");
        endDate = impliedStart.endOf("week").subtract(1, "week");
      } else if (inputText.match(/\b(yesterday)\b/i)) {
        // "Yesterday" implies one day prior
        startDate = impliedStart.subtract(1, "day");
        endDate = startDate;
      } else if (inputText.match(/\b(last month)\b/i)) {
        // "Last month" implies the previous calendar month
        startDate = impliedStart.startOf("month").subtract(1, "month");
        endDate = impliedStart.endOf("month").subtract(1, "month");
      } else if (inputText.match(/\b(last year)\b/i)) {
        // "Last year" implies the previous calendar year
        startDate = impliedStart.startOf("year").subtract(1, "year");
        endDate = impliedStart.endOf("year").subtract(1, "year");
      } else if (inputText.match(/\b(today|now)\b/i)) {
        // "Today" or "now" implies the current date
        startDate = impliedStart;
        endDate = startDate;
      } else if (inputText.match(/\b(tomorrow)\b/i)) {
        // "Tomorrow" implies the next day
        startDate = impliedStart.add(1, "day");
        endDate = startDate;
      } else {
        // Default fallback: assume a single day range
        endDate = startDate;
      }
    }

    return {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };
  });
}

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
    incrementUserInsight(userId, "aiFeaturesUsed");
    const data = await prisma.aiToken.findFirstOrThrow({ where: { userId } });

    const google = createGoogleGenerativeAI({ apiKey: data.token });

    let collection;
    const addedFilters: any[] = [];

    const dateFilter = chrono.parse(params.prompt);
    const predictedRanges = parseDateRanges(dateFilter);
    const importantTasksOnly = params.prompt.match(/\b(important)\b/i);

    if (dateFilter.length > 0)
      addedFilters.push(
        ...predictedRanges.map((d) => ({
          text: dayjs(d.startDate).isSame(dayjs(d.endDate), "day")
            ? `On ${dayjs(d.startDate).format("MMM Do")}`
            : `From ${dayjs(d.startDate).format("MMM Do")} - ${dayjs(
                d.endDate
              ).format("MMM Do")}`,
          icon: "calendar_today",
        }))
      );

    if (importantTasksOnly)
      addedFilters.push({
        text: "Important tasks only",
        icon: "priority_high",
      });

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
              start: true,
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
                  start: true,
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
        where: {
          AND: [
            { spaceId },
            importantTasksOnly ? { pinned: true } : {},
            dateFilter.length > 0
              ? {
                  AND: [
                    {
                      OR: predictedRanges.map((range) => ({
                        OR: [
                          {
                            start: { gte: range.startDate },
                            end: null,
                          },
                          {
                            start: { gte: range.startDate },
                            end: { lte: range.endDate },
                          },
                        ],
                      })),
                    },

                    { start: { not: null } },
                  ],
                }
              : {},
          ],
        },
        select: {
          name: true,
          note: true,
          start: true,
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
            r: e.start ? dayjs(e.start).format("YYYY-MM-DD HH:mm") : null,
            c: e._count.completionInstances > 0 && !e.recurrenceRule,
          })),
          l: collection.labels.map((l) => ({
            n: l.name,
            t: l.entities.map((e) => ({
              n: e.name,
              d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
              r: e.start ? dayjs(e.start).format("YYYY-MM-DD HH:mm") : null,
              c: e._count.completionInstances > 0 && !e.recurrenceRule,
            })),
          })),
        })
      : JSON.stringify({
          t: collection.map((e) => ({
            n: e.name,
            d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
            r: e.start ? dayjs(e.start).format("YYYY-MM-DD HH:mm") : null,
            c: e._count.completionInstances > 0 && !e.recurrenceRule,
          })),
        });

    const { text, usage } = await generateText({
      model: google("gemini-2.0-flash-exp"),
      // prettier-ignore
      system: `
# Instructions and format
You are an AI which will answer a user's question based on their kanban board. 
You may answer general questions outside the context of the kanban board.
When a user asks for ideas, do not repeat items already in the board, abd provide a variety of ideas.
When a user asks for an explanation, make sure you give reasoning in another sentence.
Responses should be in a conversational format. Keep them to the point, informational. A paragraph may be 1-4 sentences. Write in bullet points.
Do not mention that it is a kanban board. Keep in mind some tasks may be completed, so be aware of this when answering questions.
You do not need to repeat the question in your response, but you should answer it directly.
The input schema is defined below. 
Some may not have a date. If a user's query uses dates in any way, you may ignore tasks without a date if needed to create a better, more concise response.
When a user's query has a relative date like "last week", you may ignore tasks which are not relevant to that date range.
Do not write too much or create an overwhelming response. Keep it simple and to the point.
The current date is ${dayjs().format("YYYY-MM-DD")}

# Schema
{
    "n": string,
    "t": {
        "n": string,
        "d"?: string,
        "r"?: string,
        "c"?: boolean
    }[],
   "l": {
        "n": string,
        "t": {
          "n": string,
          "d"?: string
          "r"?: string
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
        - r: The date the task is due
        - c: Whether the task is completed or not
- t: Uncategorizedtasks in the collection. Each task has a name and a description
    - n: The name of the task
    - d: The description of the task
    - r: The date the task is due
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
    console.log(text);
    return Response.json({ generated: text, addedFilters });
  } catch (e) {
    return handleApiError(e);
  }
}
