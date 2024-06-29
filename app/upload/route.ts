import { handleApiError } from "@/lib/handleApiError";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    const file: any = formData.get("source");
    const filename = Date.now() + file.name.replaceAll(" ", "_");
    console.log("filename", filename);

    let buffer = Buffer.from(await file.arrayBuffer());

    let blob = new Blob([buffer]);

    const form = new FormData();
    const url = `https://imgcdn.dev/api/1/upload/?name=image&key=${process.env.IMAGE_API_KEY}`;
    form.append("source", blob);

    const data = await fetch(url, { method: "POST", body: form }).then((res) =>
      res.json()
    );
    console.log("data", data);
    return Response.json(data);
  } catch (e) {
    return handleApiError({ error: "Couldn't upload image" });
  }
}
