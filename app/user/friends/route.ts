import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers(req);
    // get body
    const data = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: {
        following: true,
        followers: true,
      },
    });
    // merge following and followers. email will be unique
    const list = data.following.concat(data.followers);
    return Response.json(list);
  } catch (e) {
    return handleApiError(e);
  }
}
