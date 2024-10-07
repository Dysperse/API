import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import {
  Entity,
  Integration as IntegrationObjectType,
  Label,
} from "@prisma/client";
import dayjs from "dayjs";

dayjs.extend(require("dayjs/plugin/utc"));

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export function omit(keys, obj) {
  const filteredObj = { ...obj };
  keys.forEach((key) => delete filteredObj[key]);
  return filteredObj;
}

function removeBracketedText(inputString) {
  var regex = /\s*\[.*?\]\s*$/;
  return inputString.replace(regex, "");
}

// const getIntegrationData = async (integration: {
//   id: string;
//   name: string;
//   lastSynced: Date;
//   params: Prisma.JsonValue;
//   options: Prisma.JsonValue;
//   spaceId: string;
//   userId: string;
// }) => {
//   let data;
//   const labelsToSelect = await prisma.label.findMany({
//     where: {
//       AND: [
//         { integration: { id: integration.id } },
//         { integrationParams: { not: Prisma.AnyNull } },
//       ],
//     },
//   });
//   switch (integration.name) {
//     case "google-calendar":
//       const oauth2Client = googleClient({ name: "google-calendar" });
//       oauth2Client.setCredentials(integration.params);
//       refreshGoogleAuthTokens(integration.params, oauth2Client, integration.id);

//       data = await Promise.all(
//         labelsToSelect.map((label) =>
//           fetch(
//             `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
//               (label.integrationParams as { calendarId: string }).calendarId
//             )}/events`,
//             {
//               headers: {
//                 Authorization: `Bearer ${oauth2Client.credentials.access_token}`,
//               },
//             }
//           )
//             .then((res) => res.json())
//             .then((res) => {
//               return {
//                 label,
//                 data: res.items,
//               };
//             })
//         )
//       );
//       break;
//     case "canvas-lms":
//       const d = await fetch((integration.params as any).calendarUrl).then(
//         (res) => res.text()
//       );
//       const cal = ical.parseICS(d);
//       data = {
//         items: cal,
//         labels: labelsToSelect,
//       };
//   }

//   return {
//     id: integration.id,
//     type: integration.name,
//     data,
//   };
// };

// const canonicalizeIntegrationData = (integration, entities) => {
//   let data: any[] = [];
//   switch (integration.type) {
//     case "google-calendar":
//       for (const labelData of integration.data) {
//         for (const eventData of labelData.data) {
//           const entity = entities.find(
//             (entity) => entity.integrationParams?.id === eventData.id
//           );
//           if (!entity && eventData.id && eventData.summary) {
//             data.push({
//               type: entity ? "UPDATE" : "CREATE",
//               entity: {
//                 name: eventData.summary,
//                 note: eventData.description,
//                 start: eventData.start.dateTime,
//                 end: eventData.end.dateTime,
//                 recurrenceRule: eventData.recurrence?.[0]
//                   ? RRule.fromString(
//                       eventData.recurrence?.[0].replace("EXDATE;\n", "")
//                     ).options
//                   : undefined,
//                 label: { connect: { id: labelData.label.id } },
//                 integration: { connect: { id: integration.id } },
//                 integrationParams: {
//                   id: eventData.id,
//                 },
//               },
//             });
//           }
//         }
//       }

//       break;
//     case "canvas-lms":
//       for (const _assignment in integration.data.items) {
//         const assignment = integration.data.items[_assignment];
//         const entity = entities.find(
//           (entity) => entity.integrationParams?.id === assignment.uid
//         );
//         if (
//           assignment.summary &&
//           (!entity || entity.name !== removeBracketedText(assignment.summary))
//         ) {
//           data.push({
//             type: entity ? "UPDATE" : "CREATE",
//             entity: {
//               name: removeBracketedText(assignment.summary),
//               note: assignment.description,
//               start: dayjs(assignment.start).utc().toDate(),
//               end: dayjs(assignment.end).utc().toDate(),
//               dateOnly: assignment.start.dateOnly,
//               published: true,
//               label: {
//                 connect: {
//                   id: integration.data.labels.find(
//                     (label) =>
//                       label.integrationParams.id ===
//                       extractTextInBrackets(assignment.summary)
//                   )?.id,
//                 },
//               },
//               integration: { connect: { id: integration.id } },
//               integrationParams: {
//                 id: assignment.uid,
//                 name: "Canvas LMS",
//               },
//             },
//           });
//         }
//       }

//       break;
//   }
//   return data;
// };

export interface IntegratedEntityItem {
  type: "CREATE" | "UPDATE";
  entity: Partial<Entity>;
}

export class Integration {
  integration: IntegrationObjectType & { labels: Label[] };
  raw: any[];
  canonicalData: Partial<IntegratedEntityItem>[];
  existingData: Entity[];

  constructor(integration, existingData, raw) {
    if (new.target === Integration) {
      throw new Error(
        "Cannot instantiate abstract class Integration directly."
      );
    }

    this.integration = integration;
    this.raw = raw;

    this.canonicalData = [];

    this.existingData = existingData.filter(
      (entity: Entity) => entity.integrationId === integration.id
    );
  }

  async fetchData(): Promise<any[]> {
    throw new Error("fetchData method must be implemented by the subclass.");
  }

  canonicalize(data): Partial<IntegratedEntityItem>[] {
    throw new Error("canonicalize method must be implemented by the subclass.");
  }

  async updateEntities(adapter: Integration) {
    if (adapter.canonicalData.length === 0) return;
    return await prisma.$transaction(
      adapter.canonicalData.map((item) =>
        item.type === "CREATE"
          ? prisma.entity.create({ data: { ...item.entity, type: "TASK" } })
          : prisma.entity.update({
              where: item.where,
              data: {
                ...item.entity,
                type: "TASK",
                integration: { connect: { id: adapter.integration.id } },
              },
            })
      )
    );
  }

  async processEntities() {
    const rawData = await this.fetchData();
    this.canonicalData = this.canonicalize(rawData);
    this.updateEntities(this);
    return this.canonicalData;
  }
}

const { CanvasLMSAdapter } = require("./adapters/CanvasLMSAdapter");
const { GoogleCalendarAdapter } = require("./adapters/GoogleCalendarAdapter");
const { AppleCalendarAdapter } = require("./adapters/AppleCalendarAdapter");

class IntegrationFactory {
  static createIntegration(
    integration: IntegrationObjectType,
    entities: Entity[]
  ) {
    const { type } = integration;

    switch (type) {
      case "GOOGLE_CALENDAR":
        return new GoogleCalendarAdapter(integration, entities);
      case "APPLE_CALENDAR":
        return new AppleCalendarAdapter(integration, entities);
      case "CANVAS_LMS":
        return new CanvasLMSAdapter(integration, entities);
      default:
        throw new Error("Invalid integration name.");
    }
  }
}

// This is a manual sync endpoint. It will sync all the integrations for a user when called.
export async function POST() {
  try {
    const { userId, spaceId } = await getIdentifiers();

    // Get user preference if they want private tasks by default
    const isPublished = await prisma.user.findFirstOrThrow({
      where: { id: userId },
      select: { privateTasks: true },
    });

    // Get all integrations and entities for the user
    const [integrations, entities] = await prisma.$transaction([
      prisma.integration.findMany({
        where: { userId },
        include: { labels: true },
      }),
      prisma.entity.findMany({
        where: {
          AND: [{ integration: { isNot: null } }, { spaceId }],
        },
      }),
      prisma.label.findMany({
        where: {
          AND: [{ integration: { isNot: null } }, { spaceId }],
        },
      }),
    ]);

    // 1. Gather all the data from the integrations. Canonicalize it.
    // 2. Iterate over the canonical data. For each entity:
    //    2A. If the entity doesn't exist, create it. Store a variable to identify the event, and an etag to check for changes.
    //    2B. If the entity exists, update it. Store a variable to identify the event, and an etag to check for changes.

    const canonicalData = await Promise.all(
      integrations.map(async (integration) => {
        const adapter = IntegrationFactory.createIntegration(
          integration,
          entities
        );
        adapter.processEntities();
      })
    );

    return Response.json({});
  } catch (e) {
    return handleApiError(e);
  }
}

