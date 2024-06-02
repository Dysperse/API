import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { generateRandomString } from "@/lib/randomString";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import ical from "ical";
import { RRule } from "rrule";
import { extractTextInBrackets } from "../get-labels/route";
import { googleClient } from "../redirect/route";
import { refreshGoogleAuthTokens } from "../settings/google-calendar/route";

dayjs.extend(require("dayjs/plugin/utc"));

export const dynamic = "force-dynamic";

export function omit(keys, obj) {
  const filteredObj = { ...obj };
  keys.forEach((key) => delete filteredObj[key]);
  return filteredObj;
}

function removeBracketedText(inputString) {
  var regex = /\s*\[.*?\]\s*$/;
  return inputString.replace(regex, "");
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
  const labelsToSelect = await prisma.label.findMany({
    where: {
      AND: [
        { integration: { id: integration.id } },
        { integrationParams: { not: Prisma.AnyNull } },
      ],
    },
  });
  switch (integration.name) {
    case "google-calendar":
      const oauth2Client = googleClient({ name: "google-calendar" });
      oauth2Client.setCredentials(integration.params);
      refreshGoogleAuthTokens(integration.params, oauth2Client, integration.id);

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
      break;
    case "canvas-lms":
      const d = await fetch((integration.params as any).calendarUrl).then(
        (res) => res.text()
      );
      const cal = ical.parseICS(d);
      data = {
        items: cal,
        labels: labelsToSelect,
      };
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
          if (!entity && eventData.id && eventData.summary) {
            data.push({
              type: entity ? "UPDATE" : "CREATE",
              entity: {
                name: eventData.summary,
                note: eventData.description,
                due: eventData.start.dateTime,
                recurrenceRule: eventData.recurrence?.[0]
                  ? RRule.fromString(
                      eventData.recurrence?.[0].replace("EXDATE;\n", "")
                    ).options
                  : undefined,
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

      break;
    case "canvas-lms":
      for (const _assignment in integration.data.items) {
        const assignment = integration.data.items[_assignment];
        const entity = entities.find(
          (entity) => entity.integrationParams?.id === assignment.uid
        );
        if (
          assignment.summary &&
          (!entity || entity.name !== removeBracketedText(assignment.summary))
        ) {
          // console.log(assignment.summary);
          data.push({
            type: entity ? "UPDATE" : "CREATE",
            entity: {
              name: removeBracketedText(assignment.summary),
              note: assignment.description,
              due: dayjs(assignment.start).utc().toDate(),
              dateOnly: assignment.start.dateOnly,
              labelId: integration.data.labels.find(
                (label) =>
                  label.integrationParams.id ===
                  extractTextInBrackets(assignment.summary)
              )?.id,
              integrationId: integration.id,
              integrationParams: {
                id: assignment.uid,
              },
            },
          });
        }
      }

      break;
  }
  return data;
};

export async function POST() {
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

    const res = await prisma.$transaction(
      canonicalData
        .map((data) =>
          data.map((entity) =>
            entity.type === "CREATE"
              ? prisma.entity.create({
                  data: {
                    spaceId,
                    type: "TASK",
                    shortId: generateRandomString(6),
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

    return Response.json({ data: canonicalData, res });
  } catch (e) {
    return handleApiError(e);
  }
}
