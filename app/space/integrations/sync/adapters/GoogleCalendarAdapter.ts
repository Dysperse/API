import dayjs from "dayjs";
import { googleClient } from "../../redirect/route";
import { refreshGoogleAuthTokens } from "../../settings/google-calendar/route";
import { IntegratedEntityItem, Integration } from "../route";

dayjs.extend(require("dayjs/plugin/utc"));

export class GoogleCalendarAdapter extends Integration {
  async fetchData() {
    try {
      const oauth2Client = googleClient({ name: "google-calendar" });
      oauth2Client.setCredentials((this.integration.params as any)?.tokens);

      refreshGoogleAuthTokens(
        (this.integration.params as any)?.tokens,
        oauth2Client,
        this.integration.id
      );

      const data: any = await Promise.all(
        this.integration.labels
          .filter((i: any) => i.integrationParams?.calendarId)
          .map((label) =>
            fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
                (label.integrationParams as { calendarId: string }).calendarId
              )}/events`,
              {
                headers: {
                  Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((res) => {
                return {
                  label,
                  data: res.items,
                };
              })
          )
      ).catch((e) => {
        console.log(e);
      });

      this.raw = data;
      return data;
    } catch {
      this.raw = [];
      return [];
    }
  }

  canonicalize(): Partial<IntegratedEntityItem>[] {
    try {
      const events: Partial<IntegratedEntityItem>[] = [];
      for (const label of this.raw) {
        for (const event of label.data) {
          try {
            if (!event.summary || event.recurrence) continue;
            const existingEvent = this.existingData.find(
              (existingEvent: any) =>
                existingEvent.integrationParams?.id === event.id
            );

            const hasUpdated =
              (existingEvent?.integrationParams as any)?.etag !== event.etag;

            if (!existingEvent || hasUpdated) {
              events.push({
                type: existingEvent ? "UPDATE" : "CREATE",
                where: existingEvent ? { id: existingEvent.id } : undefined,
                uniqueId: event.id,
                entity: {
                  name: event.summary,
                  note: event.description,
                  // recurrenceRule: event.recurrence
                  //   ? RRule.fromText(event.recurrence[0]).options
                  //   : null,
                  ...((event.start || event.start) && {
                    start: dayjs(event.start.date || event.start.dateTime)
                      .utc()
                      .format(),
                    end:
                      (event.end?.date || event.end?.dateTime) &&
                      dayjs(event.end.date || event.end.dateTime)
                        .utc()
                        .format(),
                    dateOnly: Boolean(event.start.date),
                  }),
                  integrationParams: {
                    id: event.id,
                    etag: event.etag,

                    // some extra fields
                    status: event.status,
                    organizer: event.organizer,
                    attendees: event.attendees,
                  },
                  attachments: [
                    ...(event.attachments || []).map((attachment) => ({
                      url: attachment.fileUrl,
                      name: attachment.title,
                    })),

                    event.location && {
                      type: event.location.startsWith("http")
                        ? "LINK"
                        : "LOCATION",
                      data: event.location,
                    },

                    event.htmlLink && {
                      type: "LINK",
                      data: event.htmlLink,
                      name: "Open in Calendar",
                    },

                    event.source && {
                      type: "LINK",
                      data: event.source.url,
                      name: "Source",
                    },

                    ...(Array.isArray(event.conferenceData?.entryPoints)
                      ? event.conferenceData.entryPoints.map((entryPoint) => ({
                          url: entryPoint.uri,
                          name: entryPoint.label,
                        }))
                      : []),
                  ].filter((e) => e),
                  ["label" as any]: { connect: { id: label.label.id } }, // yes, it works
                },
              });
            }
          } catch (e) {
            console.log(e);
          }
        }
      }
      return events;
    } catch (e) {
      return [];
    }
  }
}

