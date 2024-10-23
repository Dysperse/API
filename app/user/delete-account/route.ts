import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { verifyTurnstileToken } from "@/lib/verifyTurnstileToken";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
const STORAGE_UNITS = {
  max: 1000,
  entityMultipliers: {
    item: 1.5, // deprecated
    integration: 20,
    task: 1.5,
    labels: 2,
    collections: 10,
  },
};

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function DELETE(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "reason", required: true },
        { name: "feedback", required: true },
        { name: "alternative", required: true },
        { name: "stay", required: true },
        { name: "captcha", required: true },
      ],
      { type: "BODY" }
    );

    await verifyTurnstileToken(params.captcha);

    await fetch(
      "https://script.google.com/macros/s/AKfycbwuTc5P6NZ8RYMGxarngng4Itr6qGmgXmihukJOiMWfKUg81mfPYlWjlhTbhLIB8M4/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(params),
      }
    );

    // Find the user and include related data
    await prisma.space.delete({ where: { id: spaceId } });
    const data = await prisma.user.delete({ where: { id: userId } });

    return Response.json({ data });
  } catch (e) {
    return handleApiError(e);
  }
}
