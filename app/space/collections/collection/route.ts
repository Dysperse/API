import { getApiParams } from "@/lib/getApiParams";
import { Identifiers, getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { LexoRank } from "lexorank";
import { NextRequest } from "next/server";
import { googleClient } from "../../integrations/redirect/route";
import { refreshGoogleAuthTokens } from "../../integrations/settings/google-calendar/route";

export function omit(keys, obj) {
  const filteredObj = { ...obj };
  keys.forEach((key) => delete filteredObj[key]);
  return filteredObj;
}

const applyIntegrationAdapter = async ({
  name,
  integration,
  data,
  identifiers,
  collectionId,
}: {
  name: "google-calendar" | "gmail";
  integration: Prisma.IntegrationGetPayload<any>;
  data: Prisma.CollectionGetPayload<{
    include: {
      _count: true;
      integration: true;
      entities: Prisma.Collection$entitiesArgs<DefaultArgs>;
      labels: {
        include: {
          entities: Prisma.Collection$entitiesArgs<DefaultArgs>;
        };
      };
    };
  }>;
  identifiers: Identifiers;
  collectionId: string;
}) => {
  switch (name) {
    case "google-calendar":
      const oauth2Client = googleClient({ name: "google-calendar" });
      oauth2Client.setCredentials(integration.params);
      refreshGoogleAuthTokens(integration.params, oauth2Client, integration.id);

      // Fetch the calendars
      const { items: calendars } = await fetch(
        "https://www.googleapis.com/calendar/v3/users/me/calendarList",
        {
          headers: {
            Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
          },
        }
      ).then((res) => res.json());

      const integratedLabels = data.labels.filter((i) => i.integrationParams);
      const calendarsToSelect = integratedLabels.map(
        (i) => (i.integrationParams as any).calendarId
      );

      // Fetch the events at the same time to reduce response time
      const events = await Promise.all(
        calendarsToSelect.map((calendarId) =>
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
                    collectionId,
                    agendaOrder: LexoRank.middle().toString(),
                    labelOrder: LexoRank.middle().toString(),
                    spaceId: identifiers.spaceId,
                    labelId: integratedLabels.find(
                      (i) =>
                        (i.integrationParams as any).calendarId === calendarId
                    )?.id,
                    completionInstances: [],
                    label: omit(
                      ["entities"],
                      integratedLabels.find(
                        (i) =>
                          (i.integrationParams as any).calendarId === calendarId
                      )
                    ),
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

      // Now that we have the mapped events, we can map them to the collection labels
      for (const event of events.flat()) {
        // if the event exists in the collection, update it
        let existingEntity = data.labels
          .flatMap((i) => i.entities)
          .find((i) => i.id === event.id);
        if (existingEntity) {
          // Instead of updating the entity in the database, we'll update the entity in the data object
          existingEntity = {
            ...existingEntity,
            ...event,
          };
        } else {
          // assign the entity to the label
          const label = data.labels.find((i) => i.id === event.labelId);
          if (label) {
            label.entities.push(event);
          }
        }
      }

      return data;

    default:
      break;
  }
};

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

export async function GET(req: NextRequest) {
  try {
    const { spaceId, userId } = await getIdentifiers();
    const identifiers = await getIdentifiers();
    const params = await getApiParams(req, [
      { name: "id", required: true },
      { name: "all", required: false },
    ]);

    if (params.all) {
      const labeledEntities = await prisma.label.findMany({
        where: { spaceId },
        include: {
          entities: entitiesSelection,
        },
      });
      const unlabeledEntities = await prisma.entity.findMany({
        where: {
          AND: [{ spaceId }, { label: null }],
        },
        ...entitiesSelection,
      });
      return Response.json({
        gridOrder: labeledEntities.map((label) => label.id),
        labels: labeledEntities,
        entities: unlabeledEntities,
      });
    }

    let data = await prisma.collection.findFirstOrThrow({
      where: {
        AND: [{ userId }, { id: params.id }],
      },
      include: {
        _count: true,
        integration: true,
        entities: {
          ...entitiesSelection,
          where: {
            AND: [{ trash: false }, { label: null }],
          },
        },
        labels: {
          include: {
            entities: entitiesSelection,
          },
        },
      },
    });

    // handle integrations
    if (data.integration) {
      const integration = data.integration.name;
      data = (await applyIntegrationAdapter({
        name: integration as any,
        integration: data.integration,
        data,
        identifiers,
        collectionId: params.id,
      })) as any;
    }

    if (!data.gridOrder) data.gridOrder = data.labels.map((i) => i.id);

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
