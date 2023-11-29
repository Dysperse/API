import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const data = await fetch("https://ai.dysperse.com", {
    method: "POST",
    body,
  }).then((res) => res.json());
  return Response.json(data);
}
