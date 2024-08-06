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

export async function PUT(req: NextRequest) {
  try {
    // get body
    const { userId } = await getIdentifiers();
    const params = await getApiParams(
      req,
      [
        { name: "lastReleaseVersionViewed", required: false },
        { name: "toursViewed", required: false },
        { name: "vanishMode", required: false },
        { name: "weekStart", required: false },
        { name: "militaryTime", required: false },
        { name: "dailyStreakGoal", required: false },
        { name: "weeklyStreakGoal", required: false },
        { name: "privateTasks", required: false },
        { name: "mapsProvider", required: false },
      ],
      { type: "BODY" }
    );
    const data = await prisma.user.update({
      where: { id: userId },
      data: {
        lastReleaseVersionViewed: params.lastReleaseVersionViewed || undefined,
        toursViewed: params.toursViewed || undefined,
        weekStart: params.weekStart || undefined,
        vanishMode:
          typeof params.vanishMode === "boolean"
            ? params.vanishMode
            : undefined,
        privateTasks:
          typeof params.privateTasks === "boolean"
            ? params.privateTasks
            : undefined,
        militaryTime:
          typeof params.militaryTime === "boolean"
            ? params.militaryTime
            : undefined,

        dailyStreakGoal: params.dailyStreakGoal || undefined,
        weeklyStreakGoal: params.weeklyStreakGoal || undefined,
        mapsProvider: params.mapsProvider || undefined,
      },
    });
    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
