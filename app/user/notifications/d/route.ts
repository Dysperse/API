import webPush from "web-push";

export async function GET() {
  try {
    webPush.setVapidDetails(
      `mailto:${process.env.WEB_PUSH_EMAIL}`,
      process.env.WEB_PUSH_PUBLIC_KEY,
      process.env.WEB_PUSH_PRIVATE_KEY
    );

    await webPush.sendNotification(
      {
        keys: {
          auth: "4uDShdvRdmdR7D98yvoNag",
          p256dh: "",
        },
        endpoint: `https://fcm.googleapis.com/fcm/send/ebPUT5INt-IHct1DqjFK8b:APA91bEfhWbOrQ4UJrErf0adH7Bfu9SWglQU8ooueXPjXp4BaYy-ePXn6ThDj8UaDyftwvxDxtuhuVoHd3lSQ-tgz_yfGdNjyuphaCXhYZBuN2_svb4ZhNg6EithdKE0oTSVXiHFRwMS`,
      },
      JSON.stringify({
        title: "It's time to plan your day! 🔥",
        body: "Hi",
        data: { type: "hi" },
      })
    );

    return Response.json({ status: "ok" });
  } catch (e) {
    return handleApiError(e);
  }
}
