import dayjs from "dayjs";
import ical from "ical";
import { IntegratedEntityItem, Integration } from "../route";

dayjs.extend(require("dayjs/plugin/utc"));

// in https://iusd.instructure.com/calendar?include_contexts=course_139399&month=01&year=2025#assignment_1829142 format
// convert to [course-id]-[assignment_id]
const extractAssignmentId = (url: string) => {
  const course = url.match(/course_(\d+)/);
  const assignment = url.match(/assignment_(\d+)/);

  if (!course || !assignment) throw new Error("Invalid URL");

  return `${course[1]}-${assignment[1]}`;
};

// in https://iusd.instructure.com/calendar?include_contexts=course_139399&month=01&year=2025#assignment_1829142 format
const getAssignmentURL = (url: string) => {
  const instance = new URL(url).hostname;
  const course = url.match(/course_(\d+)/);
  const assignment = url.match(/assignment_(\d+)/);

  if (!course || !assignment) return null;

  return `https://${instance}/courses/${course[1]}/assignments/${assignment[1]}`;
};

export class CanvasLMSAdapter extends Integration {
  async fetchData() {
    if (!(this.integration as any).params?.calendarUrl) return [];

    const d = await fetch((this.integration.params as any).calendarUrl).then(
      (res) => res.text()
    );
    const cal = ical.parseICS(d);

    // Store the calendar data in the integration object
    this.raw = cal;
    return cal;
  }

  #extractTextInBrackets(name: string): string {
    const matches = name.match(/\[(.*?)\]/);
    return matches ? matches[1] : "";
  }

  #removeBracketedText(inputString) {
    var regex = /\s*\[.*?\]\s*$/;
    return inputString.replace(regex, "");
  }

  canonicalize(): Partial<IntegratedEntityItem>[] {
    const events: Partial<IntegratedEntityItem>[] = [];
    for (const k of Object.keys(this.raw)) {
      if (this.raw.hasOwnProperty(k)) {
        const assignment = this.raw[k];
        if (assignment.type == "VEVENT") {
          // For Canvas LMS, the name of the course is also the ID of the integration, which is stored in the integrationParams object
          // The course name is stored in brackets in the summary field
          // console.log(this.#extractTextInBrackets(assignment.summary));
          // We have this.existingData, which is the data that was fetched the last time the integration was run.
          // Unfortunately, canvas doesn't provide the last time the event was updated, so we only update the event if it's new
          // That being said, all we really need is a list of items which are new, based on the UID.
          // UID is stored in the integrationParams object

          const assignmentId = extractAssignmentId(assignment.url.val);

          if (
            !this.existingData.find(
              (event: any) => event.integrationParams?.id === assignmentId
            )
          ) {
            const courseId = this.#extractTextInBrackets(assignment.summary);
            const labelId = this.integration.labels.find(
              (label: any) =>
                label.integrationParams?.id === courseId ||
                label.integrationParams?.calendarId === courseId
            )?.id;

            console.log(k, assignment.url.val);

            const linkData = `<p><a href="${getAssignmentURL(
              assignment.url.val
            )}">View assignment</a></p><br/>`;

            if (labelId)
              events.push({
                type: "CREATE",
                entity: {
                  id: this.integration.id + "-" + assignmentId,
                  integrationParams: { id: assignment.url.val },
                  name: this.#removeBracketedText(assignment.summary),
                  note: `${linkData}${
                    assignment["ALT-DESC"]?.val || assignment.description
                  }`,
                  start: dayjs(assignment.start).utc().toDate(),
                  end: dayjs(assignment.end).utc().toDate(),
                  dateOnly: false,
                  published: true,
                  ["label" as any]: { connect: { id: labelId } }, // yes, it works
                },
              });
          }
        }
      }
    }

    return events;
  }
}

