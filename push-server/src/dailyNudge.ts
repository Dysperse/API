import { SentryFinish, SentryInit } from "./sentry";

const handler = {
  async fetch(): Promise<Response> {
    return new Response("\u{1F389}Push server is running!");
  },
  async scheduled(env: any) {
    const id = await SentryInit();
    // Send daily nudge to users who have daily nudge enabled
    const data = await fetch("https://my.dysperse.com/api/cron/dailyNudge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.COACH_CRON_API_KEY}`,
      },
    }).then((res) => res.json());
    console.log(data);
    await SentryFinish(id);
    return new Response("\u{1F389} Push server is running!");
  },
};

export default handler;
