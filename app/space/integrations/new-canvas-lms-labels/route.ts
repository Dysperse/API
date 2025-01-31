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

export const extractTextInBrackets = (name: string) => {
  const matches = name.match(/\[(.*?)\]/);
  return matches ? matches[1] : "";
};

type labelFormat = {
  color: string;
  emoji: string;
  name: string;
  integrationParams: { id: string };
};

const defaultCourseCustomization = [
  {
    keywords: ["computer", "comp", "programming", "coding", "tech"],
    color: "blue",
    emoji: "1f4bb",
  },
  {
    keywords: ["math"],
    color: "blue",
    emoji: "1f4d0",
  },
  {
    keywords: ["science", "bio", "chem", "phys", "astronomy"],
    color: "green",
    emoji: "1f52c",
  },
  {
    keywords: ["engineer", "robot", "stem", "steam"],
    color: "gray",
    emoji: "1F477",
  },
  {
    keywords: [
      "history",
      "social",
      "world",
      "geography",
      "econ",
      "psych",
      "gov",
      "anthro",
    ],
    color: "orange",
    emoji: "1f310",
  },
  {
    keywords: ["english", "lit", "writing", "poetry", "reading"],
    color: "red",
    emoji: "1f4da",
  },
  {
    keywords: ["spanish", "french", "korean", "german", "language"],
    color: "yellow",
    emoji: "1f4ac",
  },
  {
    keywords: ["art", "design", "music", "theater", "dance", "film"],
    color: "purple",
    emoji: "1f3a8",
  },
  {
    keywords: ["pe", "gym", "health", "sports", "exercise"],
    color: "pink",
    emoji: "1f3cb",
  },
  {
    keywords: ["advisory", "homeroom", "study", "tutoring", "office"],
    color: "gray",
    emoji: "1f4d6",
  },
  {
    keywords: ["counseling", "therapy", "support", "advising"],
    color: "gray",
    emoji: "1f9d1",
  },
];

export async function GET(req: NextRequest) {
  try {
    const { spaceId } = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "integrationId", required: true },
    ]);

    const integration = await prisma.integration.findFirstOrThrow({
      where: {
        id: params.integrationId,
        type: "NEW_CANVAS_LMS",
      },
    });

    // See: https://community.canvaslms.com/t5/Archived-Questions/ARCHIVED-Different-course-id-response-when-using-curl-vs-nodejs/m-p/494859/highlight/true#M94968
    const url = `https://${
      (integration as any).params.instanceUrl
    }/api/v1/courses?${new URLSearchParams({
      per_page: "100",
      enrollment_state: "active",
      access_token: (integration as any).params.accessToken,
    })}`;

    console.log(integration);
    const courses = await fetch(url, {
      headers: {
        Accept: "application/json+canvas-string-ids",
      },
    }).then((res) => res.json());
    console.log(courses);

    if (courses.length === 0) {
      throw new Error("No courses found");
    }

    // apply some customizations to each of the courses
    const c = courses
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .map((course) => {
        const customization = defaultCourseCustomization.find((c) =>
          c.keywords.some((keyword) =>
            course.name.toLowerCase().includes(keyword)
          )
        );

        return {
          color: customization?.color || "gray",
          emoji: customization?.emoji || "1f4d6",
          name: course.name || course.friendly_name || course.course_code,
          formalName: course.course_code,
          integrationParams: { id: course.id },
        };
      });

    return Response.json(c);
  } catch (e) {
    return handleApiError(e);
  }
}
