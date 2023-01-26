const webPush = require("web-push");

export const DispatchNotification = async ({
  subscription,
  title,
  body,
  actions,
}: {
  subscription: string;
  title: string;
  body?: string;
  actions?: { title: string; action: string }[];
}) => {
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.NEXT_PUBLIC_WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    await webPush.sendNotification(
      JSON.parse(subscription),
      JSON.stringify({
        title: title,
        body,
        actions: actions ?? [{ title: "⚡ View", action: "view" }],
      })
    );
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message };
  }
};