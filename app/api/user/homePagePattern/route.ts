import patterns from "@/app/(app)/settings/patterns.json";
import { getApiParam } from "@/lib/server/helpers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const pattern = await getApiParam(req, "pattern", true);
    const color = await getApiParam(req, "color", true);
    if (!patterns[pattern]) throw new Error("Pattern not found");
    const image = patterns[pattern].replace("[FILL_COLOR]", color);
    return new Response(decodeURI(image.replace("data:image/svg+xml,", "")), {
      status: 200,
      headers: {
        "Content-Type": "image/svg+xml",
      },
    });
  } catch (e: any) {
    console.error(e);
    return new Response(
      `<svg width="100" height="100" xmlns="http://www.w3.org/2000/svg"><!-- ${e.message} --></svg>`,
      {
        status: 200,
        headers: {
          "Content-Type": "image/svg+xml",
        },
      }
    );
  }
}
