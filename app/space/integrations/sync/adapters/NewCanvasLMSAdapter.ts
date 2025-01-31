import dayjs from "dayjs";
import { IntegratedEntityItem, Integration } from "../route";

dayjs.extend(require("dayjs/plugin/utc"));

export class NewCanvasLMSAdapter extends Integration {
  getNextPageUrl(linkHeader) {
    if (!linkHeader) return null;

    const links = linkHeader.split(",");
    for (const link of links) {
      const [urlPart, relPart] = link.split(";");
      if (relPart.includes('rel="next"')) {
        return urlPart.trim().slice(1, -1);
      }
    }
    return null;
  }

  async fetchData() {
    if (
      !(this.integration as any).params?.accessToken ||
      !(this.integration as any).params?.instanceUrl
    )
      return [];

    const courses = this.integration.labels.map(
      (label: any) => label.integrationParams?.calendarId
    );

    const i: any = this.integration.params as any;

    const fetchAssignments = async (course: string) => {
      let assignments = [];
      let nextUrl = `https://${
        i.instanceUrl
      }/api/v1/courses/${course}/assignments?${new URLSearchParams({
        per_page: "100",
        access_token: i.accessToken,
        "include[]": "submission",
      })}`;

      while (nextUrl) {
        const response = await fetch(nextUrl);
        const data = await response.json();
        assignments = assignments.concat(data);

        const linkHeader = response.headers.get("Link");
        nextUrl = this.getNextPageUrl(linkHeader);
      }

      return assignments;
    };

    const results = await Promise.allSettled(courses.map(fetchAssignments));
    const courseAssignments = results
      .filter((result) => result.status === "fulfilled")
      .map((result, index) => ({
        course: courses[index],
        assignments: (result as PromiseFulfilledResult<any[]>).value,
      }));

    this.raw = courseAssignments;
    return courseAssignments;
  }
  canonicalize(): Partial<IntegratedEntityItem>[] {
    const events: Partial<IntegratedEntityItem>[] = [];
    for (const course of this.raw) {
      for (const assignment of course.assignments) {
        const existingEvent: any = this.existingData.find(
          (event: any) =>
            event.integrationParams?.assignmentId === assignment.id
        );

        const shouldCreate = !existingEvent;

        const shouldUpdate = true;

        console.log("shouldCreate", shouldCreate, "shouldUpdate", shouldUpdate);

        if (shouldCreate || shouldUpdate) {
          const labelId = this.integration.labels.find(
            (label: any) =>
              label.integrationParams?.calendarId === course.course
          )?.id;

          const linkData = `<p><a href="${assignment.html_url}">Open in Canvas</a></p>`;

          console.log(
            "hasCompleted",
            assignment?.submission?.workflow_state &&
              assignment.submission.workflow_state !== "unsubmitted"
          );
          events.push({
            type: shouldCreate ? "CREATE" : "UPDATE",
            uniqueId: `${course.course}-${assignment.id}`,
            hasCompleted:
              assignment?.submission?.workflow_state &&
              assignment.submission.workflow_state !== "unsubmitted",
            entity: {
              integrationParams: {
                assignmentId: assignment.id,
                courseId: course.course_id,
                updatedAt: assignment.updated_at,
                createdAt: assignment.created_at,
              },
              ["label" as any]: shouldCreate
                ? { connect: { id: labelId } }
                : undefined, // yes, it works
              name: assignment.name,
              pinned: assignment.is_quiz_assignment,
              note: `${linkData} ${assignment.description}`,
              start: dayjs(assignment.due_at).isValid()
                ? dayjs(assignment.due_at).utc().toDate()
                : null,
              end: dayjs(assignment.due_at).isValid()
                ? dayjs(assignment.due_at).utc().toDate()
                : null,
              dateOnly: false,
            },
          });
        }
      }
    }

    return events;
  }
}

