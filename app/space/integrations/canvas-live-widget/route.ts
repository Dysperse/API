import { getApiParams } from "@/lib/getApiParams";
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
    const params = await getApiParams(req, [{ name: "id", required: true }]);

    const task = await prisma.entity.findFirstOrThrow({
      where: { id: params.id },
      select: { integration: true, integrationParams: true },
    });

    console.log(task);

    const url = `https://${
      (task.integration as any).params.instanceUrl
    }/api/v1/courses/${(task as any).integrationParams.courseId}/assignments/${
      (task as any).integrationParams.assignmentId
    }?${new URLSearchParams({
      access_token: (task.integration as any).params.accessToken,
      "include[]": "submission",
    })}`;

    // See: https://community.canvaslms.com/t5/Archived-Questions/ARCHIVED-Different-course-id-response-when-using-curl-vs-nodejs/m-p/494859/highlight/true#M94968
    const courses = await fetch(url, {
      headers: {
        Accept: "application/json+canvas-string-ids",
      },
    }).then((res) => res.json());
    return Response.json(courses);
  } catch (e) {
    return handleApiError(e);
  }
}
