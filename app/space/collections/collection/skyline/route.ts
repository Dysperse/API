import { getApiParams } from "@/lib/getApiParams";
import { getIdentifiers } from "@/lib/getIdentifiers";
import { handleApiError } from "@/lib/handleApiError";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { NextRequest } from "next/server";
import { RRule } from "rrule";
import { inviteLinkParams } from "../planner/inviteLinkParams";

dayjs.extend(utc);
dayjs.extend(isBetween);
dayjs.extend(tz);

export const dynamic = "force-dynamic";
export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

export async function GET(req: NextRequest) {
  try {
    const params = await getApiParams(req, [
      { name: "start", required: true },
      { name: "id", required: true },
      { name: "all", required: false },
      { name: "timezone", required: true },
      { name: "isPublic", required: false },
    ]);

    const { spaceId, userId } = await getIdentifiers(
      undefined,
      params.isPublic === "true"
    );

    dayjs.tz.setDefault("UTC");

    const start = dayjs(params.start).utc();

    // format MUST be called!
    // https://github.com/iamkun/dayjs/issues/1262
    let units = {
      today: {
        filterRange: [start, start.tz("UTC").endOf("day").format()],
        entities: [],
      },
      week: {
        filterRange: [
          start.tz("UTC").endOf("day").format(),
          start.tz("UTC").endOf("week").format(),
        ],
        entities: [],
      },
      month: {
        filterRange: [
          start.tz("UTC").endOf("week").format(),
          start.tz("UTC").endOf("month").format(),
        ],
        entities: [],
      },
      year: {
        filterRange: [
          start.tz("UTC").endOf("month").format(),
          start.tz("UTC").endOf("year").format(),
        ],
        entities: [],
      },
    };

    console.time("getTasks");
    let tasks = await prisma.entity.findMany({
      where: {
        AND: [
          params.all
            ? {}
            : {
                OR: [
                  { collectionId: params.id },
                  { collection: { inviteLink: inviteLinkParams(params.id) } },
                  { label: { collections: { some: { id: params.id } } } },
                  {
                    label: {
                      collections: {
                        some: { inviteLink: inviteLinkParams(params.id) },
                      },
                    },
                  },
                ],
              },
          { start: { not: null } },
          {
            OR: [
              { space: { id: spaceId } },
              { collection: { invitedUsers: { some: { userId } } } },
              { collection: { inviteLink: inviteLinkParams(params.id) } },
              {
                label: {
                  collections: { some: { invitedUsers: { some: { userId } } } },
                },
              },
              {
                label: {
                  collections: {
                    some: { inviteLink: inviteLinkParams(params.id) },
                  },
                },
              },
            ],
          },
          { trash: false },
          {
            OR: [
              {
                AND: [
                  { recurrenceRule: { equals: Prisma.AnyNull } },
                  { start: { gte: units.today[0], lte: units.year[1] } },
                ],
              },
              { recurrenceRule: { not: Prisma.AnyNull } },
            ],
          },
        ],
      },
      orderBy: { completionInstances: { _count: "asc" } },
      include: {
        completionInstances: {
          select: { id: true, completedAt: true, iteration: true },
          where: {
            iteration: { gte: units.today[0], lte: units.year[1] },
          },
        },
        label: true,
      },
    });
    console.timeEnd("getTasks");

    const recurringTasks = tasks.filter((task) => task.recurrenceRule);
    const normalTasks = tasks.filter((task) => task.recurrenceRule === null);

    // Populate the tasks for each perspective unit
    for (const task of recurringTasks) {
      if (!task.recurrenceRule) continue;
      const rule = new RRule({
        ...(task as any).recurrenceRule,
        dtstart: new Date((task as any).recurrenceRule.dtstart),
        until:
          (task.recurrenceRule as any).until &&
          new Date((task as any).recurrenceRule.until),
      }).between(start.toDate(), dayjs(start).endOf("year").toDate(), true);

      // if one of the instances lies between any of the units, add the task to that unit. Only add the task once.

      let added = false;
      for (const instance of rule) {
        const instanceStart = dayjs(instance).utc();
        for (const [unitName, unit] of Object.entries(units)) {
          if (
            instanceStart.isBetween(unit.filterRange[0], unit.filterRange[1])
          ) {
            unit.entities.push({
              ...task,
              recurrenceDay: instanceStart.toISOString(),
            } as never);
            added = true;
            break;
          }
        }
        if (added) break;
      }
    }

    for (const task of normalTasks) {
      const taskStart = dayjs(task.start).utc();
      const unit = Object.values(units).find(({ filterRange }) =>
        taskStart.isBetween(filterRange[0], filterRange[1], null, "[]")
      );
      if (unit) unit.entities.push(task as never);
    }

    return Response.json(units);
  } catch (e) {
    return handleApiError(e);
  }
}

