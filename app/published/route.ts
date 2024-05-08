import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: {
      "Access-Control-Allow-Headers": "*",
    },
  });
};

export const nonReadOnlyPermissionArgs = (
  userId: string,
  params,
  spaceId
): Prisma.EntityWhereInput => ({
  AND: [
    // For people within the space
    { AND: [{ id: params.id }, { spaceId }] },
    // For people outside the space but invited
    {
      OR: [
        { collection: null },
        { spaceId },
        {
          collection: {
            invitedUsers: {
              some: {
                AND: [
                  { userId },
                  { access: { not: "READ_ONLY" } },
                  { id: params.id },
                ],
              },
            },
          },
        },
      ],
    },
    {
      OR: [
        { label: null },
        { label: { spaceId } },
        {
          label: {
            collections: {
              some: {
                invitedUsers: {
                  some: {
                    AND: [
                      { userId },
                      { access: { not: "READ_ONLY" } },
                      { id: params.id },
                    ],
                  },
                },
              },
            },
          },
        },
      ],
    },
  ],
});

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const data = await prisma.entity.findFirstOrThrow({
      where: {
        OR: [
          { AND: [{ published: true, id: params.id }] },
          { AND: [{ published: true, shortId: params.id }] },
        ],
      },
      include: {
        completionInstances: true,
        label: true,
        collection: true,
        space: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    console.log(data);
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);
    const data = await prisma.entity.updateMany({
      where: nonReadOnlyPermissionArgs(userId, params, spaceId),
      data: {
        trash: true,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
