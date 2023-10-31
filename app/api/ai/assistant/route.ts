import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const data = await fetch("https://ai.dysperse.com", {
    method: "POST",
    body: req.body,
  }).then((res) => res.json());
  return Response.json(data);
}
