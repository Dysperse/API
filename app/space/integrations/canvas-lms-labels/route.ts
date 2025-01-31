import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import ical from "ical";
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
    const params = await getApiParams(req, [
      { name: "calendarUrl", required: false },
    ]);

    const data = await fetch(params.calendarUrl).then((res) => res.text());
    const cal = ical.parseICS(data);

    // Extract the course names from the events
    const courses: Set<string> = new Set();
    for (const k in cal) {
      if (cal.hasOwnProperty(k)) {
        if (cal[k].type == "VEVENT") {
          courses.add(extractTextInBrackets(cal[k].summary));
        }
      }
    }

    if (courses.size === 0) {
      throw new Error("No courses found in the calendar");
    }

    // apply some customizations to each of the courses

    const c = Array.from(courses).map((course) => {
      const customization = defaultCourseCustomization.find((c) =>
        c.keywords.some((keyword) => course.toLowerCase().includes(keyword))
      );

      return {
        emoji: customization?.emoji ?? "1f4d6",
        color: customization?.color ?? "blue",
        name: course,
        integrationParams: { id: course },
      } as labelFormat;
    });

    return Response.json(c);
  } catch (e) {
    return handleApiError(e);
  }
}
