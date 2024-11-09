import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import { inviteLinkParams } from "../planner/inviteLinkParams";

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};
export async function POST(req: NextRequest) {
  try {
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "pinCode", required: true },
      ],
      { type: "BODY" }
    );
    const { userId } = await getIdentifiers(
      undefined,
      params.isPublic === "true"
    );

    await prisma.collection.findFirstOrThrow({
      where: {
        AND: [
          {
            OR: [
              { AND: [{ userId }, { id: params.id }] },
              {
                AND: [
                  { invitedUsers: { some: { userId } } },
                  { id: params.id },
                ],
              },
              { inviteLink: inviteLinkParams(params.id) },
            ],
          },
          { pinCode: params.pinCode },
        ],
      },
      select: { id: true },
    });

    const t = dayjs().add(1, "hour").toISOString();
    await prisma.collection.update({
      where: { id: params.id },
      data: { pinAuthorizationExpiresAt: t },
    });

    return Response.json({ success: true, expiresAt: t });
  } catch (e) {
    return handleApiError(e);
  }
}
