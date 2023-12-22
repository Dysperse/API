import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // get body
    const params = await getApiParams(req, [{ name: "email", required: true }]);
    const data = await prisma.user.findFirstOrThrow({
      where: {
        email: params.email,
      },
      select: {
        username: true,
        email: true,
        followers: true,
        following: true,
        profile: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
