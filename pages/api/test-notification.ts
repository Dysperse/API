import { DispatchNotification } from "../../lib/server/notification";

export default async function handler(req, res) {
  console.log("🔔 Push notification trigger received");

  await DispatchNotification({
    subscription: req.query.subscription,
    title: "Swoosh!",
    body: "Notificiations are working!",
  });

  res.status(200).json({ success: true });
}
