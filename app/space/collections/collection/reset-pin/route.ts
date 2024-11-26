import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import argon2 from "argon2";
import { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "password", required: true },
      ],
      { type: "BODY" }
    );

    const user = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { password: true },
    });

    const valid = await argon2.verify(user.password, params.password);

    if (!valid) {
      throw new Error("Invalid password");
    }

    const data = await prisma.collection.updateMany({
      data: {
        id: params.refreshId ? uuidv4() : undefined,
        pinCode: null,
      },
    });

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
