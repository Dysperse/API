import { getApiParam, handleApiError } from "@/lib/server/helpers";
import { prisma } from "@/lib/server/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const email = await getApiParam(req, "email", false);
    const basic = await getApiParam(req, "basic", false);

    const data = await prisma.follows.findMany({
      where: {
        AND: [{ accepted: false }, { followingId: email }],
      },
      include: {
        follower: basic
          ? undefined
          : {
              select: {
                name: true,
                email: true,
                color: true,
                Profile: {
                  select: { picture: true },
                },
              },
            },
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
