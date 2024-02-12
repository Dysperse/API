import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import ical from "ical";
import { NextRequest } from "next/server";

const extractTextInBrackets = (name: string) => {
  const matches = name.match(/\[(.*?)\]/);
  return matches ? matches[1] : "";
};

type labelFormat = { text: string; id: string };

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "integration", required: true },
      { name: "canvas_url", required: false },
    ]);

    switch (params.integration) {
      case "canvas-lms":
        const data = await fetch(params.canvas_url).then((res) => res.text());
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

        return Response.json({
          labelOptions: Array.from(courses).map(
            (course) =>
              ({
                text: course,
                id: course,
              } as labelFormat)
          ),
        });

      default:
        throw new Error("Integration not found");
    }
  } catch (e) {
    return handleApiError(e);
  }
}
