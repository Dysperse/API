import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { incrementUserInsight } from "@/lib/insights";
import { prisma } from "@/lib/prisma";
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
    const params = await getApiParams(req, [{ name: "id", required: true }], {
      type: "BODY",
    });
    const { userId } = await getIdentifiers();
    incrementUserInsight(userId, "aiFeaturesUsed");
    const data = await prisma.collection.findFirstOrThrow({
      where: {
        AND: [{ id: params.id }, { userId }],
      },
      select: {
        name: true,
        entities: {
          select: {
            name: true,
            note: true,
          },
        },
        labels: {
          select: {
            name: true,
            entities: {
              select: {
                name: true,
                note: true,
              },
            },
          },
        },
      },
    });

    return Response.json({
      n: data.name,
      t: data.entities.map((e) => ({
        n: e.name,
        d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
      })),
      l: data.labels.map((l) => ({
        n: l.name,
        t: l.entities.map((e) => ({
          n: e.name,
          d: e.note ? NodeHtmlMarkdown.translate(e.note) : undefined,
        })),
      })),
    });
  } catch (e) {
    return handleApiError(e);
  }
}
