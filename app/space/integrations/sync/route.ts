import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";
import { googleClient } from "../redirect/route";
import { refreshGoogleAuthTokens } from "../settings/google-calendar/route";

export function omit(keys, obj) {
  const filteredObj = { ...obj };
  keys.forEach((key) => delete filteredObj[key]);
  return filteredObj;
}

const getIntegrationData = async (integration: {
  id: string;
  name: string;
  lastSynced: Date;
  params: Prisma.JsonValue;
  options: Prisma.JsonValue;
  spaceId: string;
  userId: string;
}) => {
  let data;
  switch (integration.name) {
    case "google-calendar":
      const oauth2Client = googleClient({ name: "google-calendar" });
      oauth2Client.setCredentials(integration.params);
      refreshGoogleAuthTokens(integration.params, oauth2Client, integration.id);

      const labelsToSelect = await prisma.label.findMany({
        where: {
          AND: [
            { integration: { id: integration.id } },
            { integrationParams: { not: Prisma.AnyNull } },
          ],
        },
      });

      data = await Promise.all(
        labelsToSelect.map((label) =>
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
      );
  }

  return {
    id: integration.id,
    type: integration.name,
    data,
  };
};

const canonicalizeIntegrationData = (integration, entities) => {
  let data: any[] = [];
  switch (integration.type) {
    case "google-calendar":
      for (const labelData of integration.data) {
        for (const eventData of labelData.data) {
          const entity = entities.find(
            (entity) => entity.integrationParams?.id === eventData.id
          );
          if (
            (!entity || entity.name !== eventData.summary) &&
            eventData.summary
          ) {
            data.push({
              type: entity ? "UPDATE" : "CREATE",
              entity: {
                name: eventData.summary,
                note: eventData.description,
                due: eventData.start.dateTime,
                recurrenceRule: eventData.recurrence?.[0],
                labelId: labelData.label.id,
                integrationId: integration.id,
                integrationParams: {
                  id: eventData.id,
                },
              },
            });
          }
        }
      }
  }
  return data;
};

export async function GET(req: NextRequest) {
  try {
    const { userId, spaceId } = await getIdentifiers();

    const [integrations, entities] = await Promise.all([
      prisma.integration.findMany({
        where: { userId },
      }),
      prisma.entity.findMany({
        where: {
          AND: [{ integration: { isNot: null } }, { spaceId }],
        },
      }),
    ]);

    // Make this performant to reduce API response time
    // 1. Gather all the data from the integrations. Canonicalize it.
    // 2. If the entity has a different version of the data, update it.
    // 3. If the entity doesn't have the data, create it.
    // 4. If the entity has data that the integration doesn't, delete it.

    const data = await Promise.allSettled(
      integrations.map((integration) => getIntegrationData(integration))
    );

    const canonicalData = data.map((integration: any) =>
      canonicalizeIntegrationData(integration.value, entities)
    );

    await prisma.$transaction(
      canonicalData
        .map((data) =>
          data.map((entity) =>
            entity.type === "CREATE"
              ? prisma.entity.create({
                  data: {
                    spaceId,
                    type: "TASK",
                    ...entity.entity,
                  },
                })
              : prisma.entity.updateMany({
                  where: {
                    integrationParams: {
                      path: ["id"],
                      equals: entity.entity.integrationParams.id,
                    },
                  },
                  data: entity.entity,
                })
          )
        )
        .flat()
    );
    console.log(canonicalData);

    return Response.json(data);
  } catch (e) {
    return handleApiError(e);
  }
}
