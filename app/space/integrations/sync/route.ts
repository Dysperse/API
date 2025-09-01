import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { generateRandomString } from "@/lib/randomString";
import {
  Entity,
  Integration as IntegrationObjectType,
  Label,
  Prisma,
} from "@prisma/client";
import dayjs from "dayjs";

dayjs.extend(require("dayjs/plugin/utc"));

export const dynamic = "force-dynamic";
export const maxDuration = 20;

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

export interface IntegratedEntityItem {
  type: "CREATE" | "UPDATE";
  entity: Partial<Prisma.EntityCreateManyLabelInput>;
  where?: Prisma.EntityWhereInput;
  uniqueId: string;
  hasCompleted?: boolean;
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
    if (!adapter.canonicalData || adapter.canonicalData.length === 0) return;

    return await prisma.$transaction(
      adapter.canonicalData
        .map((item: any) => {
          const entityOperation =
            item.type === "CREATE"
              ? prisma.entity.create({
                  data: {
                    ...item.entity,
                    id: `${adapter.integration.id}-${item.uniqueId}`,
                    type: "TASK",
                    shortId: generateRandomString(8),
                    space: { connect: { id: adapter.integration.spaceId } },
                    integration: { connect: { id: adapter.integration.id } },
                  },
                })
              : prisma.entity.updateMany({
                  limit: 1,
                  data: item.entity,
                  where: { id: `${adapter.integration.id}-${item.uniqueId}` },
                });

          if (item.hasCompleted) {
            const completionInstanceOperation =
              prisma.completionInstance.create({
                data: {
                  task: {
                    connect: {
                      id: `${adapter.integration.id}-${item.uniqueId}`,
                    },
                  },
                  completedAt: new Date(),
                },
              });

            return [entityOperation, completionInstanceOperation];
          }

          return entityOperation;
        })
        .flat()
    );
  }

  async processEntities() {
    const rawData = await this.fetchData();
    this.canonicalData = this.canonicalize(rawData);
    const t = this.updateEntities(this);
    return t;
  }
}

const { CanvasLMSAdapter } = require("./adapters/CanvasLMSAdapter");
const { GoogleCalendarAdapter } = require("./adapters/GoogleCalendarAdapter");
const { AppleCalendarAdapter } = require("./adapters/AppleCalendarAdapter");
const { NewCanvasLMSAdapter } = require("./adapters/NewCanvasLMSAdapter");

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
      case "NEW_CANVAS_LMS":
        return new NewCanvasLMSAdapter(integration, entities);
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
      prisma.integration.updateMany({
        where: { userId },
        data: { lastSynced: new Date() },
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

    const l = await Promise.all(
      integrations
        .map(async (integration) => {
          try {
            const adapter = IntegrationFactory.createIntegration(
              integration,
              entities
            );
            console.log(
              "\x1b[33m",
              "  ⏳ Processing integration",
              integration.type,
              integration.id,
              "\x1b[0m"
            );
            return adapter.processEntities();
          } catch (e) {
            console.error(e);
            return null;
          }
        })
        .filter((e) => e)
    );

    return Response.json(l);
  } catch (e) {
    return handleApiError(e);
  }
}

