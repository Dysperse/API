import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: false }]);
    const integrations = await fetch(
      "https://app.dysperse.com/integrations.json"
    ).then((res) => res.json());
    const data = await prisma.integration.findMany({
      where: params.id ? { id: params.id } : { userId },
      include: {
        createdBy: true,
        labels: true,
      },
    });
    return Response.json(
      data.map((integration) => ({
        integration,
        about: integrations.find((i) => i.slug === integration.name),
      }))
    );
  } catch (e) {
    return handleApiError(e);
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "id", required: true },
        { name: "name", required: false },
        { name: "params", required: false },
        { name: "labels", required: false },
      ],
      { type: "BODY" }
    );

    const data = await prisma.integration.update({
      where: { id: params.id },
      data: {
        space: { connect: { id: spaceId } },
        createdBy: { connect: { id: userId } },
      },
    });

    if (Object.keys(params.labels).length > 0)
      await prisma.$transaction(
        Object.keys(params.labels).map((label) =>
          prisma.label.update({
            where: { id: params.labels[label] },
            data: { integration: { connect: { id: params.id } } },
          })
        )
      );

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await getIdentifiers();
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    await prisma.$transaction([
      prisma.integration.deleteMany({
        where: {
          AND: [{ id: params.id }, { createdBy: { id: userId } }],
        },
      }),
      prisma.entity.deleteMany({
        where: {
          AND: [
            { integration: { id: params.id } },
            { integration: { createdBy: { id: userId } } },
          ],
        },
      }),
    ]);

    return Response.json({ success: true });
  } catch (e) {
    return handleApiError(e);
  }
}
