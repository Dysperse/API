import { omit } from "@/app/space/collections/collection/omit";
import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

const getDescription = async (content, labels): Promise<any> => {
  try {
    console.log(content);
    const res = await fetch(
      "https://api-inference.huggingface.co/models/mistralai/Mistral-Nemo-Instruct-2407/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.IMAGE_CAPTIONING_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "mistralai/Mistral-Nemo-Instruct-2407",
          messages: [
            {
              role: "system",
              content: `
You are an AI which will assign a label to a task based on its name. Sometimes previous tasks in the category will be provided.
You will wrap reasoning in <r></r> tags. Try not to categorize tasks in a miscellaneous category.
Outside that, you will provide the label ID of the label that the task should be categorized under. 
Do not include any surrounding text. and only provide the label ID immediately after the </r> tag.
        
Available labels: 
${labels.map(
  (l, i) => `
ID: ${i}, Name: "${l.name}", ${
    l.entities.length > 0 ? "Previous tasks in category" : ""
  }: ${l.entities.map((e) => e.name).join(", ")}`
)}

--------
Example:
# Input
## Task name
Submit APUSH essay draft to Google Classroom by 11:59 PM

## Available labels:
- ID: 1, Name: "math"
    - Finish AP Precalc quiz
- ID: 2, Name: "science"
    - Complete AP Chem lab report
    - Finalize AP Bio project
    - Kinematics FRQs 
- ID: 3, Name: "history"
    - DBQ on the Civil War
    - Finish APUSH essay draft
    - WWII notes
- ID: 4, Name: "english"
    - Read chapters 1-5 of The Great Gatsby
    - Finish AP Lang essay
    - Complete AP Lit assignment

# Response
<r>Task is related to history</r>3
`,
            },
            {
              role: "user",
              content: `Task name: ${content}`,
            },
          ],
          max_tokens: 4096,
          stream: false,
        }),
      }
    ).then((r) => r.json());

    console.log(res.choices[0].message.content);
    if (res.choices[0].message.content.split("</r>").length) {
      return omit(
        ["entities"],
        labels[parseInt(res.choices[0].message.content.split("</r>")[1])]
      );
    }
  } catch (e) {
    return { id: null };
  }
};
export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "name", required: true },
        { name: "collectionId", required: false },
      ],
      {
        type: "BODY",
      }
    );

    const labels = await prisma.label.findMany({
      where: {
        userId,
        collections: params.collectionId
          ? { some: { id: params.collectionId } }
          : undefined,
      },
      include: {
        entities: {
          select: { id: true, name: true },
          take: 10,
        },
      },
    });

    const note = await getDescription(params.name, labels);

    return Response.json(note);
  } catch (e) {
    return handleApiError(e);
  }
}
