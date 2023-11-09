// pages/api/proxy.js

import { getApiParam, handleApiError } from "@/lib/server/helpers";
import http from "http";
import https from "https";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = await getApiParam(req, "url", true);

  const protocol = url.startsWith("https") ? https : http;

  try {
    protocol.get(url, (response) => {
      if (response.statusCode !== 200) {
        return handleApiError({ error: "Failed to fetch the image." });
      }
    });
  } catch (error) {
    return handleApiError({ error: "Failed to fetch the image." });
  }

  // You need to return a response here, so I've added the following lines
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Content-Type": "text/plain", // You should set the appropriate content type here
    },
  });
}
