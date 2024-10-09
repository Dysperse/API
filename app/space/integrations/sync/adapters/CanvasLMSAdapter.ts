import { generateRandomString } from "@/lib/randomString";
import dayjs from "dayjs";
import ical from "ical";
import { IntegratedEntityItem, Integration } from "../route";

dayjs.extend(require("dayjs/plugin/utc"));

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

          if (
            !this.existingData.find(
              (event: any) => event.integrationParams?.id === k
            ) &&
            k
          ) {
            const labelId = this.integration.labels.find(
              (label: any) =>
                label.integrationParams?.id ===
                this.#extractTextInBrackets(assignment.summary)
            )?.id;

            if (labelId)
              events.push({
                type: "CREATE",
                entity: {
                  integrationParams: { id: k },
                  name: this.#removeBracketedText(assignment.summary),
                  note: assignment.description,
                  start: dayjs(assignment.start).utc().toDate(),
                  end: dayjs(assignment.end).utc().toDate(),
                  dateOnly: assignment.start.dateOnly,
                  published: true,
                  ["label" as any]: { connect: { id: labelId } }, // yes, it works
                  attachments: [
                    assignment.url && {
                      type: "LINK",
                      data: assignment.url.val,
                    },
                  ],
                  shortId: generateRandomString(8),
                },
              });
          }
        }
      }
    }

    return events;
  }
}

