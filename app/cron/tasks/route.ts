import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import utc from "dayjs/plugin/utc";
import { Expo, ExpoPushMessage } from "expo-server-sdk";
import { RRule } from "rrule";
import webPush from "web-push";

dayjs.extend(utc);
dayjs.extend(relativeTime);

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

const normalizeRecurrenceRuleObject = (rule) => {
  if (!rule) return null;
  return new RRule({
    ...rule,
    ...(rule.until && { until: dayjs(rule.until).toDate() }),
    ...(rule.dtstart && { dtstart: dayjs(rule.dtstart).toDate() }),
  });
};

function capitalizeFirstLetter(str: string) {
  return typeof str === "string"
    ? str.charAt(0).toUpperCase() + str.slice(1)
    : "";
}

const getHighestInArray = (arr) => Math.max(...arr);

export async function POST() {
  let expo = new Expo({
    useFcmV1: true,
  });
  webPush.setVapidDetails(
    `mailto:${process.env.WEB_PUSH_EMAIL}`,
    process.env.WEB_PUSH_PUBLIC_KEY,
    process.env.WEB_PUSH_PRIVATE_KEY
  );
  const users = await prisma.user.findMany({
    select: {
      notificationSubscriptions: {
        select: { tokens: true, type: true },
      },
      spaces: {
        select: {
          space: {
            select: {
              entities: {
                where: {
                  OR: [
                    {
                      AND: [
                        { start: { not: null } },
                        { start: { gt: dayjs().utc().toISOString() } },
                        { NOT: { notifications: { isEmpty: true } } },
                      ],
                    },
                    {
                      AND: [
                        { start: null },
                        { recurrenceRule: { not: Prisma.AnyNull } },
                      ],
                    },
                  ],
                },
                select: {
                  id: true,
                  name: true,
                  notifications: true,
                  start: true,
                  recurrenceRule: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const data = users.filter(
    (user) =>
      user.notificationSubscriptions.length > 0 &&
      user.spaces?.[0]?.space &&
      user.spaces[0].space.entities.length > 0
  );

  const messages = data
    .map((user) => {
      return user.spaces[0].space.entities
        .filter((entity) => {
          if (entity.start) {
            return entity.notifications.find((notification) => {
              return (
                dayjs(entity.start).utc().diff(dayjs().utc(), "minute") ===
                notification
              );
            });
          } else if (entity.recurrenceRule) {
            const rule = normalizeRecurrenceRuleObject(entity.recurrenceRule);

            return (
              rule &&
              rule.between(
                dayjs().utc().toDate(),
                dayjs()
                  .utc()
                  .add(getHighestInArray(entity.notifications), "minute")
                  .toDate()
              ).length > 0
            );
          }
        })
        .map((entity) => {
          return user.notificationSubscriptions.map(
            (tokens): ExpoPushMessage => {
              return {
                to: tokens.tokens as any,
                title: entity.name,
                body: capitalizeFirstLetter(
                  dayjs(entity.start).fromNow() || entity.recurrenceRule
                    ? normalizeRecurrenceRuleObject(
                        entity.recurrenceRule
                      )?.toText() || "Upcoming event"
                    : "Upcoming event"
                ),
                data: { id: entity.id, type: tokens.type },
              };
            }
          );
        })
        .flat();
    })
    .flat();

  const expoMessages = expo.chunkPushNotifications(
    messages.filter((message: any) => message.data.type === "EXPO").flat()
  );

  let status: [number, number] = [0, 0];

  (async () => {
    for (let chunk of expoMessages) {
      try {
        let ticketChunk = await expo.sendPushNotificationsAsync(chunk);
        console.log(ticketChunk);
        status[0]++;
      } catch (error) {
        console.error(error);
        status[1]++;
      }
    }
  })();

  const webMessages = messages.filter(
    (message: any) => message.data.type === "WEB"
  );

  for (const message of webMessages) {
    const response = await webPush.sendNotification(
      message.to,
      JSON.stringify(message)
    );
    status[response.statusCode !== 201 ? 1 : 0]++;
  }

  return Response.json({
    success: status[0],
    failed: status[1],
  });
}
