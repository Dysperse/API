import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default (req: NextRequest) => {
  return new Response(`Hello, from ${req.url} I'm now an Edge API Route!`);
};

export const config = {
  runtime: "experimental-edge",
};
