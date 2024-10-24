import { Notification } from "@/lib/notifications";
import { prisma } from "@/lib/prisma";
import dayjs from "dayjs";
import tz from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { Expo } from "expo-server-sdk";
import { NextRequest } from "next/server";
import webPush from "web-push";

dayjs.extend(utc);
dayjs.extend(tz);

export const dynamic = "force-dynamic";

export const OPTIONS = async () => {
  return new Response("", {
    status: 200,
    headers: { "Access-Control-Allow-Headers": "*" },
  });
};

const randomMessage = () => {
  const messages = [
    "vision check! what's on ur agenda!? 📋👓",
    "CEO of ur life! time to strategize 📝",
    "rise n' shine. time to conquer the day 💪",
    "morning, champ! ready to rock ur schedule? 🎸",
    "lights, camera, action! plan ur scene 🎥",
    "rise n' grind! time to hustle 🏃‍♂️",
    "I heard checking your TikTok feed is a great way to start the day! (pls don't do that)",
    "well, well, well, look at you. don't you dare snooze that alarm - it's time to plan your day ⏰",
    "big brother is watching u complete your tasks 👀",
    `"𝔠𝔬𝔪𝔭𝔩𝔢𝔱𝔢 𝔪𝔢! 🥺" — ur to-do list`,
    "they say the early bird gets the worm. but who wants worms? 🤮",
    "not saying you're a procrastinator, but you better be planning your day rn... 🐢",
    "not ready to plan your day? that's okay, I'll wait... 😔💔",
    "make me happy and plan your day, please? 🥺",
    "bro you're not gonna believe this... but it's time to plan your day 🤯",
    "once upon a time, in a land far, far away (ur room), a hero (u) woke up and planned their day. the end.",
    "not all heroes wear capes. some just plan their day. 🦸‍♂️",
    "what's the plan, stan? 🤔",
    "personally I like sleeping in, but I guess planning your day is cool too 🛌",
    "imagine not planning ur day... couldn't be me 🤡",
    "I checked the news this morning. it said you should plan your day 📰",
    "ur friends were conspiring against u. they said u should plan ur day 🤫",
    "NEWS FLASH: Officials report that it's now time to plan ur day 🚨",
    "ur a procrastinator if u didn't click on this 🫵😹",
  ];

  return messages[Math.floor(Math.random() * messages.length)];
};

export async function POST(req: NextRequest) {
  const body = randomMessage();

  if (
    process.env.NODE_ENV !== "development" &&
    req.headers.get("Authorization") !== `Bearer ${process.env.CRON_SECRET}`
  )
    throw new Error("Access denied");
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
      timeZone: true,
      notificationSubscriptions: {
        select: { tokens: true, type: true },
      },
    },
    where:
      process.env.NODE_ENV === "development"
        ? { email: "manusvathgurudath@gmail.com" }
        : undefined,
  });

  const data = users.filter(
    (user) => user.notificationSubscriptions.length > 0
  );

  const messages = data
    .map((user) => {
      if (dayjs().tz(user.timeZone).hour() !== 1) return [];

      const tokens = user.notificationSubscriptions;
      return tokens.map((token) => {
        return {
          ["fcmTo" as any]: token,
          to: token.tokens as any,
          title: "it's time to plan ur day...",
          body,
          data: { type: token.type },
        };
      });
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
    (message: any) => message.data.type !== "EXPO"
  );

  for (const message of webMessages) {
    const response = await new Notification("FORCE", message).send(
      (message as any).fcmTo
    );
    console.log(response);
    status[response ? 0 : 1]++;
  }

  return Response.json({
    success: status[0],
    failed: status[1],
  });
}
