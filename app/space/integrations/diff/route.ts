import { getApiParams } from "@/lib/getApiParams";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { NextRequest } from "next/server";
import { googleClient } from "../../integrations/redirect/route";
import { refreshGoogleAuthTokens } from "../../integrations/settings/google-calendar/route";

export function omit(keys, obj) {
  const filteredObj = { ...obj };
  keys.forEach((key) => delete filteredObj[key]);
  return filteredObj;
}

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "collectionId", required: true },
    ]);

    const integration = await prisma.integration.findFirstOrThrow({
      where: { id: params.id },
    });

    const entities = await prisma.entity.findMany({
      where: {
        AND: [
          {
            OR: [
              { collectionId: params.collectionId },
              { label: { collections: { some: { id: params.collectionId } } } },
            ],
          },
          {
            integrationParams: { not: Prisma.AnyNull },
          },
        ],
      },
    });

    switch (integration.name) {
      case "google-calendar":
        const oauth2Client = googleClient({ name: "google-calendar" });
        oauth2Client.setCredentials(integration.params);
        refreshGoogleAuthTokens(
          integration.params,
          oauth2Client,
          integration.id
        );

        // Fetch the calendars
        const { items: calendars } = await fetch(
          "https://www.googleapis.com/calendar/v3/users/me/calendarList",
          {
            headers: {
              Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
            },
          }
        ).then((res) => res.json());

        // Fetch the events at the same time to reduce response time
        const events = await Promise.all(
          calendars.map((calendarId) =>
            fetch(
              `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events`,
              {
                headers: {
                  Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
                },
              }
            )
              .then((res) => res.json())
              .then((res) => {
                if (!res.items) return [];
                return res.items.map(
                  (item: any) =>
                    ({
                      id: "integration-" + item.id,
                      type: "TASK",
                      name: item.summary,
                      pinned: false,
                      note: item.description,
                      trash: false,
                      due: item.start.dateTime,
                      dateOnly: false,
                      recurrenceRule: item.recurrence?.[0],
                      notifications: [
                        ...calendars
                          .find((i) => i.id === calendarId)
                          .defaultReminders?.map((i: any) => i.minutes),
                        ...(item.reminders.useDefault
                          ? []
                          : item.reminders.overrides?.map(
                              (i: any) => i.minutes
                            ) || []),
                      ].filter(
                        (value, index, array) => array.indexOf(value) === index
                      ),
                      //   labelId: integratedLabels.find(
                      //     (i) =>
                      //       (i.integrationParams as any).calendarId === calendarId
                      //   )?.id,
                      completionInstances: [],
                      attachments:
                        item.attachments?.map((i: any) => ({
                          type: "LINK",
                          data: i.fileUrl,
                        })) || [],
                      integrationData: {
                        attendees: item.attendees,
                      },
                    } as Prisma.EntityCreateInput)
                );
              })
          )
        );

      default:
        break;
    }
  } catch (e) {
    return handleApiError(e);
  }
}

export const entitiesSelection: Prisma.Collection$entitiesArgs<DefaultArgs> = {
  include: {
    completionInstances: true,
    label: true,
    attachments: {
      select: {
        data: true,
        type: true,
      },
    },
  },
  where: {
    trash: false,
  },
};
