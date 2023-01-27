const handler = {
  async fetch(
    request: Request,
    env: any,
    ctx: ExecutionContext
  ): Promise<Response> {
    return new Response("🎉 Push server is running!");
  },
  async scheduled(controller: any, env: any, ctx: any) {
    // Send daily nudge to users who have daily nudge enabled
    const data = await fetch("https://my.dysperse.com/api/cron/dailyNudge", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.COACH_CRON_API_KEY}`,
      },
    });
    console.log(data);
    return new Response("🎉 Push server is running!");
  },
};

export default handler;
