import { SentryFinish, SentryInit } from "./sentry";

const handler = {
  async fetch(): Promise<any> {
    return new Response("\u{1F389}Push server is running!");
  },

  async scheduled(_: any, env: any) {
    const id = await SentryInit();
    const params = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.COACH_CRON_API_KEY}`,
      },
    };

    // Send daily nudge to users who have daily nudge enabled
    await fetch("https://my.dysperse.com/api/cron/dailyNudge", params);

    // Delete vanishing tasks
    await fetch(
      "https://my.dysperse.com/api/cron/deleteVanishingTasks",
      params
    );

    // Daily check in nudge
    await fetch("https://my.dysperse.com/api/cron/dailyCheckInNudge", params);

    // Task thingy
    await fetch("https://my.dysperse.com/api/cron/taskReminder", params);

    // Daily check in nudge
    await fetch(
      "https://my.dysperse.com/api/cron/deleteExpiredQrCodes",
      params
    );

    await SentryFinish(id);
    return new Response("\u{1F389} Push server is running!");
  },
};

export default handler;
