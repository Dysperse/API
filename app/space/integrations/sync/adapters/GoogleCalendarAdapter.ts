import dayjs from "dayjs";
import { googleClient } from "../../redirect/route";
import { refreshGoogleAuthTokens } from "../../settings/google-calendar/route";
import { IntegratedEntityItem, Integration } from "../route";

dayjs.extend(require("dayjs/plugin/utc"));

export class GoogleCalendarAdapter extends Integration {
  async fetchData() {
    const cal = [];

    const oauth2Client = googleClient({ name: "google-calendar" });
    oauth2Client.setCredentials(this.integration.params);

    refreshGoogleAuthTokens(
      this.integration.params,
      oauth2Client,
      this.integration.id
    );

    const data = await Promise.all(
      this.integration.labels
        .filter((i) => i.integrationParams?.calendarId)
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

    console.log(data);

    // Store the calendar data in the integration object
    this.raw = cal;
    return cal;
  }

  canonicalize(): Partial<IntegratedEntityItem>[] {
    return [];
  }
}
