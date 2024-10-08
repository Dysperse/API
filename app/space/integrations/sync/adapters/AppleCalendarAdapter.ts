import { generateRandomString } from "@/lib/randomString";
import dayjs from "dayjs";
import ical from "ical";
import { RRule } from "rrule";
import { IntegratedEntityItem, Integration } from "../route";

dayjs.extend(require("dayjs/plugin/utc"));

export class AppleCalendarAdapter extends Integration {
  async fetchData() {
    if (!(this.integration as any).params?.calendarUrl) return [];

    const d = await fetch(
      (this.integration.params as any).calendarUrl.replace("webcal", "https")
    ).then((res) => res.text());
    const cal = ical.parseICS(d);

    // Store the calendar data in the integration object
    this.raw = cal;
    return cal;
  }

  canonicalize(): Partial<IntegratedEntityItem>[] {
    const events: Partial<IntegratedEntityItem>[] = [];
    for (const k of Object.keys(this.raw)) {
      if (this.raw.hasOwnProperty(k)) {
        try {
          const event = this.raw[k];
          if (event && event.type == "VEVENT") {
            const eventExists = this.existingData.find(
              (e: any) => e.integrationParams?.id === event.uid
            );

            const eventHasUpdated =
              eventExists &&
              (eventExists?.integrationParams as any)?.lastmodified &&
              dayjs(event.lastmodified) >
                dayjs((eventExists.integrationParams as any).lastmodified);

            if (eventHasUpdated || !eventExists) {
              events.push({
                type: eventExists ? "UPDATE" : "CREATE",
                where: eventExists
                  ? {
                      AND: [
                        { integrationId: this.integration.id },
                        { integrationParams: { id: event.uid } },
                      ],
                    }
                  : undefined,
                entity: {
                  integrationParams: {
                    id: event.uid,
                    lastmodified: event.lastmodified,

                    // some extra fields
                    status: event.status,
                    organizer: event.organizer,
                    attendees: JSON.parse(
                      JSON.stringify(
                        Array.isArray(event.attendee)
                          ? event.attendee.filter((e) => e)
                          : [event.attendee]
                      )
                    ),
                  },
                  name: event.summary,
                  note: event.description,
                  start: dayjs(event.start).toDate(),
                  end: dayjs(event.end).toDate(),
                  dateOnly:
                    event.start.dateOnly === true ||
                    event.end.dateOnly === true,
                  published: true,
                  attachments: [
                    event.location && {
                      type: event.location.startsWith("http")
                        ? "LINK"
                        : "LOCATION",
                      data: event.location,
                    },
                    event.url && {
                      type: "LINK",
                      data: event.url,
                    },
                    Array.isArray(event.attach)
                      ? event.attach
                          .filter((e) =>
                            e.params.FMTTYPE?.startsWith?.("image/")
                          )
                          .map((e) => ({
                            type: "IMAGE",
                            data: e.val,
                            name: e.params?.FILENAME,
                          }))
                      : event.attach &&
                        event.attach.params.FMTTYPE?.startsWith?.("image/") && {
                          type: "IMAGE",
                          data: event.attach.val,
                          name: event.attach.params?.FILENAME,
                        },
                  ].filter((e) => e),
                  ...(event.rrule && {
                    recurrenceRule: JSON.parse(
                      JSON.stringify(new RRule(event.rrule.options).options)
                    ),
                  }),
                  shortId: generateRandomString(8),
                },
              });
            }
          }
        } catch (e) {
          console.error("Error processing event", e);
        }
      }
    }

    this.canonicalData = events;
    return events;
  }
}
