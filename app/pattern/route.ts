import { getApiParams } from "@/lib/getApiParams";
import patterns from "@/patterns.json";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "pattern", required: true },
      { name: "color", required: true },
    ]);
    if (!patterns[params.pattern]) throw new Error("Pattern not found");
    const image = patterns[params.pattern].replace(
      "[FILL_COLOR]",
      params.color
    );
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
          "Cache-Control": "max-age=864000",
        },
      }
    );
  }
}
